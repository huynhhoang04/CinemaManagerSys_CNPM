export const Table = ({ headers, data, renderRow }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-left whitespace-nowrap">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-3 font-medium text-gray-900">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};