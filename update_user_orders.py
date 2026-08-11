import re

with open("src/components/UserOrdersTab.tsx", "r") as f:
    text = f.read()

# Add imports
text = text.replace("import { AdminOrder } from '../types';", "import { AdminOrder } from '../types';\nimport { motion, AnimatePresence } from 'motion/react';")

# Add state for modal
text = text.replace("const [orders, setOrders] = useState<AdminOrder[]>([]);", "const [orders, setOrders] = useState<AdminOrder[]>([]);\n  const [selectedNoteOrder, setSelectedNoteOrder] = useState<AdminOrder | null>(null);")

# Update table headers
text = text.replace('<th className="p-4 font-semibold">Status</th>', '<th className="p-4 font-semibold">Status</th>\n                <th className="p-4 font-semibold text-right">Actions</th>')

# Update row colSpan
text = text.replace('colSpan={5}', 'colSpan={6}')

# Add Actions cell and remove the old adminNote row
old_row_end = """                    <td className="p-4">
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

new_row_end = """                    <td className="p-4">
                      {getStatusBadge(order.status)}
                      {order.status === 'rejected' && order.rejectionReason && (
                        <div className="mt-1 text-xs text-rose-400">
                          {order.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedNoteOrder(order)}
                        className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 flex items-center gap-1.5 ml-auto shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        View Note
                      </button>
                    </td>
                  </tr>"""
text = text.replace(old_row_end, new_row_end)

# Add modal at the end before last div
modal_code = """
      <AnimatePresence>
        {selectedNoteOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Admin Note
                </h3>
                <button 
                  onClick={() => setSelectedNoteOrder(null)} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {selectedNoteOrder.adminNote ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>Updated: {new Date(selectedNoteOrder.updatedAt).toLocaleString()}</span>
                    </div>
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5 text-sm text-cyan-100/90 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedNoteOrder.adminNote}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <FileText className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm">No admin note has been added yet.</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
                <button 
                  onClick={() => setSelectedNoteOrder(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors border border-white/5"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
"""

text = text.replace("    </div>\n  );\n}", modal_code + "    </div>\n  );\n}")

with open("src/components/UserOrdersTab.tsx", "w") as f:
    f.write(text)
