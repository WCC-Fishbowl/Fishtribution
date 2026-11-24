import Link from "next/link"

const adminTable = [
    {
        label: "Upload Taxon Images",
        url: "/admin/uploadTaxonImages"
    },
]

export default function TestPage() {
    return <div>
        <p className="text-3xl font-bold p-4">Tests</p>
        {
            adminTable.map(element => {
                return <div key={element.url}>
                    <Link href={element.url}>
                        {element.label}
                    </Link>
                </div>
            })
        }
    </div>
}
