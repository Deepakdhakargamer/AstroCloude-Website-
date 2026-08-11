import re

with open("src/components/UserOrdersTab.tsx", "r") as f:
    text = f.read()

old_effect = """  useEffect(() => {
    getStoredOrders().then(data => setOrders(data));
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => {
        window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
    };
  }, []);"""

new_effect = """  useEffect(() => {
    getStoredOrders().then(data => setOrders(data));
    const handleOrdersUpdate = (e: any) => {
        setOrders(e.detail);
        setSelectedNoteOrder(prev => {
            if (prev) {
                return e.detail.find((o: AdminOrder) => o.id === prev.id) || prev;
            }
            return null;
        });
    };
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => {
        window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
    };
  }, []);"""

text = text.replace(old_effect, new_effect)

with open("src/components/UserOrdersTab.tsx", "w") as f:
    f.write(text)
