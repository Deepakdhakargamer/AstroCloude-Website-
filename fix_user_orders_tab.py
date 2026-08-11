with open("src/components/UserOrdersTab.tsx", "r") as f:
    text = f.read()

# Replace state init
text = text.replace("const [orders, setOrders] = useState<AdminOrder[]>(() => getStoredOrders());", "const [orders, setOrders] = useState<AdminOrder[]>([]);")

# Replace useEffect
old_use_effect = """  useEffect(() => {
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    const handleStorage = (e: StorageEvent) => {
        if (e.key === 'astro_orders') {
            setOrders(JSON.parse(e.newValue || '[]'));
        }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
        window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
        window.removeEventListener('storage', handleStorage);
    };
  }, []);"""

new_use_effect = """  useEffect(() => {
    getStoredOrders().then(data => setOrders(data));
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => {
        window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
    };
  }, []);"""

text = text.replace(old_use_effect, new_use_effect)

with open("src/components/UserOrdersTab.tsx", "w") as f:
    f.write(text)
