import re

with open("src/components/UserOrdersTab.tsx", "r") as f:
    text = f.read()

# Replace the closing </tr> to optionally render a second row for the note, or just embed it inside a colSpan row if it has an adminNote
# We will use React.Fragment

old_row = """                    <td className="p-4">
                      {getStatusBadge(order.status)}
                      {order.status === 'rejected' && order.rejectionReason && (
                        <div className="mt-1 text-xs text-rose-400">
                          {order.rejectionReason}
                        </div>
                      )}
                    </td>
                  </tr>"""

new_row = """                    <td className="p-4">
                      {getStatusBadge(order.status)}
                      {order.status === 'rejected' && order.rejectionReason && (
                        <div className="mt-1 text-xs text-rose-400">
                          {order.rejectionReason}
                        </div>
                      )}
                    </td>
                  </tr>
                  {order.adminNote && (
                    <tr className="bg-cyan-500/5 border-b border-white/5">
                      <td colSpan={5} className="p-4">
                        <div className="flex gap-3">
                          <div className="mt-1 flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                              <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-2">
                              Admin Note
                              <span className="text-[10px] text-slate-500 font-normal bg-slate-900 px-1.5 py-0.5 rounded">
                                Updated: {new Date(order.updatedAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm text-cyan-100/80 whitespace-pre-wrap">
                              {order.adminNote}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}"""

text = text.replace(old_row, new_row)
text = text.replace("orders.map((order) => (", "orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (\n                <React.Fragment key={order.id}>")
text = text.replace("</tr>\n                ))", "</tr>\n                )}</React.Fragment>\n                ))")
# Fix the replace manually to be sure

with open("src/components/UserOrdersTab.tsx", "w") as f:
    f.write(text)
