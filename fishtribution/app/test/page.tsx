import Link from "next/link"

const testTable = [
    {
        label: "Image Component",
        url: "/test/image"
    },
    {
        label: "File Upload", 
        url: "/test/upload"
    },
]

export default function TestPage() {
    return <div>
        <p className="text-3xl font-bold p-4">Tests</p>
        {
            testTable.map(element => {
                return <div key={element.url}>
                    <Link href={element.url}>
                        {element.label}
                    </Link>
                </div>
            })
        }
    </div>
}