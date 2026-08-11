with open("src/components/AdminPanel.tsx", "r") as f:
    text = f.read()

admin_sync = """  useEffect(() => {
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

text = text.replace("""  useEffect(() => {
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
  }, []);""", admin_sync)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(text)

with open("src/components/UserOrdersTab.tsx", "r") as f:
    text2 = f.read()

text2 = text2.replace("""  useEffect(() => {
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
  }, []);""", admin_sync)

with open("src/components/UserOrdersTab.tsx", "w") as f:
    f.write(text2)

