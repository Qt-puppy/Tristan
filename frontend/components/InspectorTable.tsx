"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface Remediation {
  original_clause: string;
  suggested_clause: string;
  reason: string;
}

interface InspectorTableProps {
  remediations: Remediation[];
}

export default function InspectorTable({ remediations }: InspectorTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!remediations || remediations.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900/50">
        No risky clauses detected.
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900">
      <table className="w-full text-left text-sm text-zinc-300">
        <thead className="bg-zinc-800/50 text-xs uppercase font-medium text-zinc-400">
          <tr>
            <th className="px-6 py-4">Flagged Clause</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {remediations.map((item, idx) => (
            <React.Fragment key={idx}>
              <tr 
                className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
              >
                <td className="px-6 py-4 font-medium max-w-2xl truncate text-zinc-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    {item.original_clause}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-400 hover:text-white flex items-center justify-end w-full gap-1">
                    {expandedRow === idx ? "Hide Remediation" : "View Remediation"}
                    {expandedRow === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
              {expandedRow === idx && (
                <tr className="bg-zinc-950">
                  <td colSpan={2} className="px-6 py-6 border-b border-zinc-800">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase font-semibold text-red-400 mb-2">Original Risk</h4>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-zinc-300">
                          {item.original_clause}
                        </div>
                        <p className="mt-3 text-sm text-zinc-400"><span className="font-semibold text-zinc-300">Reasoning:</span> {item.reason}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase font-semibold text-emerald-400 mb-2">Suggested Compliant Clause</h4>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-100 font-medium">
                          {item.suggested_clause}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
