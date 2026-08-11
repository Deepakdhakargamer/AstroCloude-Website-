with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()

text = text.replace("import { AdminCategory, AdminHostingPlan, AdminSupportTicket, AdminUser, AdminRole, AdminTicketMessage, AdminFeature } from '../types';", "import { AdminCategory, AdminHostingPlan, AdminSupportTicket, AdminUser, AdminRole, AdminTicketMessage, AdminFeature, AdminOrder } from '../types';")
text = text.replace("import { getStoredPaymentSettings, saveStoredPaymentSettings, PaymentSettings } from '../utils/paymentSync';", "import { getStoredPaymentSettings, saveStoredPaymentSettings, PaymentSettings } from '../utils/paymentSync';\nimport { getStoredOrders, updateStoredOrders } from '../utils/orderSync';")

state_injection = """  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => getStoredPaymentSettings());
  const [orders, setOrders] = useState<AdminOrder[]>(() => getStoredOrders());
  
  useEffect(() => {
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
  }, []);"""

text = text.replace("  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => getStoredPaymentSettings());", state_injection)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)
