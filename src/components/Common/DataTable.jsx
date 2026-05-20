import React from 'react';

export default function DataTable({ columns, data, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-700/50 rounded w-full"></div>
        <div className="h-10 bg-gray-700/50 rounded w-full"></div>
        <div className="h-10 bg-gray-700/50 rounded w-full"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-md">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800/80">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-gray-700/30 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
