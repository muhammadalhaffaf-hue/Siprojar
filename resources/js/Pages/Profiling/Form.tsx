import { useState } from "react";
import { Form, Link } from "@inertiajs/react";
export default function FormPage({ profiling, opds }: any) {
    const edit = Boolean(profiling?.id);
    const [selectedIssues, setSelectedIssues] = useState<string[]>(
        Array.from(
            new Set(
                profiling?.kendala?.map((item: any) =>
                    item.nama_kendala?.trim() ? "lainnya" : item.jenis_kendala,
                ) ?? [],
            ),
        ),
    );
    const [otherIssueName, setOtherIssueName] = useState(
        profiling?.kendala?.find((item: any) => item.nama_kendala)
            ?.nama_kendala ?? "",
    );
    const issueOptions = [
        { value: "koneksi_putus", label: "Koneksi Putus" },
        { value: "bandwidth_kurang", label: "Speed Lambat" },
        { value: "device", label: "Perangkat Rusak" },
        { value: "topologi", label: "Konfigurasi Jaringan" },
        { value: "sosialisasi", label: "Gangguan ISP" },
        { value: "lainnya", label: "Lainnya" },
    ];
    const otherIssueIndex = selectedIssues.indexOf("lainnya");
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-2xl rounded bg-white p-6 shadow">
                <h1 className="mb-4 text-2xl font-bold">
                    {edit ? "Edit" : "Isi"} Profiling
                </h1>
                <Form
                    action={
                        edit
                            ? route("profiling.update", profiling.id)
                            : route("profiling.store")
                    }
                    method={edit ? "put" : "post"}
                    className="grid gap-3"
                >
                    <select
                        name="opd_id"
                        defaultValue={profiling?.opd_id ?? ""}
                        className="rounded border p-2"
                    >
                        <option value="">Pilih OPD</option>
                        {opds.map((opd: any) => (
                            <option key={opd.id} value={opd.id}>
                                {opd.nama_opd}
                            </option>
                        ))}
                    </select>
                    <input
                        name="periode"
                        required
                        placeholder="Periode, contoh: 2026"
                        defaultValue={profiling?.periode ?? ""}
                        className="rounded border p-2"
                    />
                    <input
                        name="jumlah_device"
                        required
                        type="number"
                        min="0"
                        placeholder="Jumlah device"
                        defaultValue={profiling?.jumlah_device ?? 0}
                        className="rounded border p-2"
                    />
                    <input
                        name="aplikasi[]"
                        placeholder="Nama aplikasi utama"
                        className="rounded border p-2"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            name="kecepatan_unduh"
                            type="number"
                            step="0.01"
                            placeholder="Download Mbps"
                            className="rounded border p-2"
                        />
                        <input
                            name="kecepatan_unggah"
                            type="number"
                            step="0.01"
                            placeholder="Upload Mbps"
                            className="rounded border p-2"
                        />
                    </div>
                    <select
                        name="hasil"
                        defaultValue="sesuai"
                        className="rounded border p-2"
                    >
                        <option value="sesuai">Sesuai</option>
                        <option value="tidak_sesuai">Tidak sesuai</option>
                    </select>
                    <fieldset className="grid gap-2 rounded border p-3">
                        <legend className="px-1 text-sm font-medium">
                            Kendala jaringan (boleh pilih lebih dari satu)
                        </legend>
                        {issueOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIssues.includes(
                                        option.value,
                                    )}
                                    onChange={(event) =>
                                        setSelectedIssues((current) =>
                                            event.target.checked
                                                ? [...current, option.value]
                                                : current.filter(
                                                      (issue) =>
                                                          issue !==
                                                          option.value,
                                                  ),
                                        )
                                    }
                                />
                                {option.label}
                            </label>
                        ))}
                        {selectedIssues.map((issue, index) => (
                            <input
                                key={issue}
                                type="hidden"
                                name={`kendala[${index}][jenis_kendala]`}
                                value={issue}
                            />
                        ))}
                    </fieldset>
                    {otherIssueIndex !== -1 && (
                        <input
                            name={`kendala[${otherIssueIndex}][nama_kendala]`}
                            required
                            maxLength={150}
                            placeholder="Sebutkan kendala lainnya"
                            value={otherIssueName}
                            onChange={(event) =>
                                setOtherIssueName(event.target.value)
                            }
                            className="rounded border p-2"
                        />
                    )}
                    <textarea
                        name="kesimpulan"
                        placeholder="Kesimpulan"
                        defaultValue={profiling?.kesimpulan ?? ""}
                        className="rounded border p-2"
                    />
                    <label className="flex gap-2">
                        <input type="checkbox" name="ajukan" value="1" /> Ajukan
                        untuk verifikasi
                    </label>
                    <button className="rounded bg-blue-600 p-2 text-white">
                        Simpan
                    </button>
                    <Link
                        href={route("profiling.index")}
                        className="text-center text-blue-600"
                    >
                        Kembali
                    </Link>
                </Form>
            </div>
        </div>
    );
}
