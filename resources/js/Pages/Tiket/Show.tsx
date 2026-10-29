import { Form, Link } from "@inertiajs/react";
import { useState } from "react";
import { CheckCircle2, Download, FileUp } from "lucide-react";

const statusLabelMap: Record<string, string> = {
    baru: "Baru",
    diteruskan: "Diteruskan",
    proses: "Proses",
    menunggu_verifikasi: "Menunggu Verifikasi",
    selesai: "Selesai",
    ditolak: "Ditolak",
};

const statusStyleMap: Record<string, string> = {
    baru: "bg-sky-100 text-sky-700",
    diteruskan: "bg-violet-100 text-violet-700",
    proses: "bg-amber-100 text-amber-700",
    menunggu_verifikasi: "bg-orange-100 text-orange-700",
    selesai: "bg-emerald-100 text-emerald-700",
    ditolak: "bg-rose-100 text-rose-700",
};

const formatTicketDate = (value?: string) => {
    if (!value) return "-";

    try {
        return new Date(value).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    } catch {
        return value;
    }
};

export default function Show({ ticket, role }: any) {
    const [status, setStatus] = useState("proses");
    const statusRoute =
        role === "pihak_ketiga" ? "vendor.tiket.status" : "tiket.status";
    const isVendor = role === "pihak_ketiga";
    const isAwaitingEvidence =
        status === "menunggu_verifikasi" || status === "selesai";
    const issueTitle =
        ticket.kendala?.jenis_kendala ||
        ticket.kendala?.deskripsi ||
        "Tiket jaringan";
    const statusKey = ticket.status || "baru";
    const assignedTo =
        ticket.pihak_ketiga?.nama_vendor ??
        (ticket.ditangani_internal ? "Internal" : "Belum ditentukan");

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <Link
                        href={route("tiket.index")}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
                    >
                        ← Kembali
                    </Link>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyleMap[statusKey] ?? "bg-slate-100 text-slate-600"}`}
                    >
                        {statusLabelMap[statusKey] ?? statusKey}
                    </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-8">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    {ticket.nomor_tiket}
                                </span>
                                <h1 className="mt-2 text-2xl font-extrabold text-slate-800 md:text-[2rem]">
                                    {issueTitle}
                                </h1>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>
                                {ticket.kendala?.profiling?.opd?.nama_opd ?? "OPD"}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>
                                {formatTicketDate(ticket.created_at ?? ticket.updated_at)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 p-6 md:p-8">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                    Vendor
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    {assignedTo}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                    Kategori
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    {ticket.kendala?.jenis_kendala ?? "-"}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                    Prioritas
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    {ticket.prioritas ?? "Standar"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                Deskripsi Kendala
                            </p>
                            <p className="mt-3 text-sm leading-7 text-slate-700">
                                {ticket.kendala?.deskripsi || "Tidak ada deskripsi."}
                            </p>
                        </div>

                        {isVendor && ticket.status === "diteruskan" ? (
                            <Form
                                action={route(statusRoute, ticket.id)}
                                method="post"
                                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                            >
                                <input type="hidden" name="status" value="proses" />
                                <input
                                    type="hidden"
                                    name="catatan"
                                    value="Vendor menerima tiket dan mulai melakukan penanganan."
                                />
                                <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500">
                                    <CheckCircle2 size={17} /> Terima &amp; Mulai Proses
                                </button>
                            </Form>
                        ) : null}

                        {role !== "opd" &&
                        ticket.status !== "selesai" &&
                        (!isVendor || ticket.status !== "diteruskan") ? (
                            <Form
                                action={route(statusRoute, ticket.id)}
                                method="post"
                                forceFormData
                                className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-700">
                                        Perbarui Status
                                    </p>
                                    <span className="text-xs text-slate-400">
                                        {statusLabelMap[status] ?? "Proses"}
                                    </span>
                                </div>
                                <select
                                    name="status"
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none ring-0 transition focus:border-blue-300 focus:bg-white"
                                >
                                    {isVendor ? (
                                        <>
                                            <option value="proses">Proses</option>
                                            <option value="menunggu_verifikasi">
                                                Menunggu verifikasi
                                            </option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="proses">Proses</option>
                                            <option value="selesai">Selesai</option>
                                            <option value="ditolak">Ditolak</option>
                                        </>
                                    )}
                                </select>
                                <textarea
                                    name="catatan"
                                    required
                                    placeholder="Catatan tindakan"
                                    rows={3}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
                                />
                                {isAwaitingEvidence ? (
                                    <label className="grid gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                                            <FileUp
                                                size={17}
                                                className="text-blue-700"
                                            />
                                            Bukti penanganan {status === "menunggu_verifikasi" ? "(wajib)" : "(opsional)"}
                                        </span>
                                        <input
                                            type="file"
                                            name="bukti_file"
                                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                            required={status === "menunggu_verifikasi"}
                                            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:font-semibold file:text-blue-800"
                                        />
                                        <span className="text-xs text-slate-500">
                                            Format JPG, PNG, PDF; maksimal 5 MB.
                                        </span>
                                    </label>
                                ) : null}
                                <button className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500">
                                    Perbarui Status
                                </button>
                            </Form>
                        ) : null}

                        <div>
                            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Histori Tiket
                            </h2>
                            <div className="space-y-0 rounded-2xl border border-slate-200 bg-slate-50">
                                {ticket.riwayat?.map((item: any, index: number) => (
                                    <div
                                        key={item.id ?? `${item.status_baru}-${index}`}
                                        className={`relative pl-10 pr-4 py-4 ${index !== (ticket.riwayat?.length ?? 1) - 1 ? "border-b border-slate-200" : ""}`}
                                    >
                                        <div className="absolute left-4 top-5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300 shadow-sm" />
                                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                            <p className="text-sm font-bold capitalize text-slate-700">
                                                {statusLabelMap[item.status_baru] ?? item.status_baru}
                                            </p>
                                            <span className="text-xs text-slate-400">
                                                {formatTicketDate(item.created_at)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            {item.catatan || "Tidak ada catatan."}
                                        </p>
                                        {item.bukti_file ? (
                                            <a
                                                href={route("tiket.evidence", item.id)}
                                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
                                            >
                                                <Download size={14} /> Unduh bukti penanganan
                                            </a>
                                        ) : null}
                                    </div>
                                ))}
                                {!ticket.riwayat || ticket.riwayat.length === 0 ? (
                                    <div className="px-4 py-5 text-sm text-slate-500">
                                        Belum ada riwayat tiket.
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
