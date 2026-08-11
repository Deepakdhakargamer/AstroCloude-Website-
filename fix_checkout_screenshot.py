import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "import { FileText, ArrowLeft, CreditCard, ShieldCheck, Server, Cpu, Database, HardDrive, Wifi, Lock, QrCode, Smartphone, Copy, CheckCircle2 } from 'lucide-react';",
    "import { Upload, Image as ImageIcon, FileText, ArrowLeft, CreditCard, ShieldCheck, Server, Cpu, Database, HardDrive, Wifi, Lock, QrCode, Smartphone, Copy, CheckCircle2 } from 'lucide-react';"
)

state_old = "const [paymentSettings, setPaymentSettings] = useState(() => getStoredPaymentSettings());"
state_new = "const [paymentSettings, setPaymentSettings] = useState(() => getStoredPaymentSettings());\n  const [screenshot, setScreenshot] = useState<File | null>(null);"
content = content.replace(state_old, state_new)


upload_ui = """                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      Payment Proof
                    </h3>
                    <div className="bg-slate-950/50 border border-blue-500/30 rounded-xl p-4 sm:p-6 space-y-4 relative overflow-hidden text-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="payment-screenshot"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setScreenshot(e.target.files[0]);
                          }
                        }}
                      />
                      <label
                        htmlFor="payment-screenshot"
                        className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                      >
                        {screenshot ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <span className="text-sm text-emerald-400 font-semibold">{screenshot.name} uploaded</span>
                            <span className="text-xs text-slate-500">Click to change file</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400" />
                            <span className="text-sm text-white font-semibold">Upload Payment Screenshot</span>
                            <span className="text-xs text-slate-500">PNG, JPG, JPEG up to 5MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
"""

old_order_notes = """                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-purple-400" />
                      Order Notes"""

content = content.replace(old_order_notes, upload_ui + "\n" + old_order_notes)

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

