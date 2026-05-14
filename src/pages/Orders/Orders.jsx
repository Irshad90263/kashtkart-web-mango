import React, { useState, useEffect } from 'react';
import { getUserOrdersApi, cancelOrderApi } from '../../api/order';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { XCircle, Package, Calendar, MapPin, CreditCard, ShoppingBag, CheckCircle2, Eye, X, Clock, Info, Printer, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Footer from '../../components/layout/Footer';
import Loader from '../../components/common/Loader';

const InvoiceModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPdf = async () => {
        const element = document.getElementById('printable-invoice');
        if (!element) return;

        setIsGenerating(true);

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById('printable-invoice');
                    if (clonedElement) {
                        clonedElement.style.height = 'auto';
                        clonedElement.style.maxHeight = 'none';
                        clonedElement.style.overflow = 'visible';
                        clonedElement.style.display = 'block';
                        const content = clonedElement.querySelector('.printable-content');
                        if (content) {
                            content.style.height = 'auto';
                            content.style.maxHeight = 'none';
                            content.style.overflow = 'visible';
                        }
                        const allElements = clonedElement.querySelectorAll('*');
                        allElements.forEach(el => {
                            const computedStyle = window.getComputedStyle(el);
                            if (computedStyle.color && computedStyle.color.includes('oklch')) {
                                el.style.color = '#000000';
                            }
                            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
                                el.style.backgroundColor = '#ffffff';
                            }
                            if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
                                el.style.borderColor = '#000000';
                            }
                        });
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.75);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const pageHeight = pdf.internal.pageSize.getHeight();

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }
            pdf.save(`Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
            toast.success("Invoice downloaded successfully!", { position: "top-right" });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to download PDF. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const today = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[#ffffff] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 relative border border-gray-100">
                <div id="printable-invoice" className="flex flex-col flex-1 overflow-hidden bg-white">
                    <div className="flex flex-row justify-between items-start p-6 pb-4 border-b border-gray-50 bg-white relative">
                        <div className="w-16">
                            <img src="/sks-logo.jpg" alt="SKS Logo" className="w-full h-auto" />
                        </div>
                        <div className="text-right text-[11px] leading-tight mt-4">
                            {/* <p className="font-black uppercase tracking-wider text-gray-400 mb-1">Tax Invoice</p> */}
                            <p className="font-bold text-gray-700">Date: {today}</p>
                            <p className="font-bold text-gray-700">OrderId: #{order._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <button
                            onClick={onClose}
                            data-html2canvas-ignore
                            className="absolute -top-1 -right-1 md:top-2 md:right-2 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar printable-content">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6 gap-4">
                                <div>
                                    <p className="font-black uppercase text-gray-400 mb-1.5" style={{ fontSize: '8px' }}>Bill From:</p>
                                    <div className="leading-tight">
                                        <p className="font-bold text-gray-900" style={{ fontSize: '9px' }}>SKS Laddu</p>
                                        <p className="text-gray-500" style={{ fontSize: '9px' }}>Ahirawan, Sandila, UP</p>
                                        <p className="text-gray-500 mt-0.5" style={{ fontSize: '9px' }}>8467831372, 6307736698</p>
                                    </div>
                                </div>
                                <div className="text-right max-w-[180px] ml-auto">
                                    <p className="font-black uppercase text-gray-400 mb-1.5" style={{ fontSize: '8px' }}>Bill To:</p>
                                    <div className="leading-tight">
                                        <p className="font-bold text-gray-900 break-words" style={{ fontSize: '9px', wordWrap: 'break-word' }}>{order.shippingAddress?.name}</p>
                                        <p className="text-gray-500 break-words" style={{ fontSize: '9px', wordWrap: 'break-word' }}>{order.shippingAddress?.addressLine1}</p>
                                        <p className="text-gray-500 break-words" style={{ fontSize: '9px', wordWrap: 'break-word' }}>{order.shippingAddress?.city}</p>
                                        <p className="text-gray-500 mt-0.5 break-words" style={{ fontSize: '9px', wordWrap: 'break-word' }}>{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 mb-6" />

                            <div className="mb-6">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[9px] text-gray-400 uppercase">
                                            <th className="text-left py-3 font-black">Item Description</th>
                                            <th className="text-center py-3 font-black">Qty</th>
                                            <th className="text-right py-3 font-black">Rate</th>
                                            <th className="text-right py-3 font-black">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-50 last:border-0">
                                                <td className="py-3 text-left font-bold text-gray-700">{item.productName}</td>
                                                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                                <td className="py-3 text-right text-gray-600">₹{item.productPrice}</td>
                                                <td className="py-3 text-right font-black text-gray-900">₹{item.productPrice * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 border-t border-gray-100 pt-6">
                                <div className="flex justify-between w-full md:w-52 text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider">Subtotal</span>
                                    <span className="text-gray-900 font-bold">₹{order.subtotal}</span>
                                </div>
                                {order.shippingCharges > 0 && (
                                    <div className="flex justify-between w-full md:w-52 text-[10px]">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider">Shipping</span>
                                        <span className="text-gray-900 font-bold">₹{order.shippingCharges}</span>
                                    </div>
                                )}
                                {order.handlingFee > 0 && (
                                    <div className="flex justify-between w-full md:w-52 text-[10px]">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider">Handling</span>
                                        <span className="text-gray-900 font-bold">₹{order.handlingFee}</span>
                                    </div>
                                )}
                                {order.discount > 0 && (
                                    <div className="flex justify-between w-full md:w-52 text-[10px]">
                                        <span className="text-red-400 font-bold uppercase tracking-wider">Discount</span>
                                        <span className="text-red-500 font-bold">-₹{order.discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between w-full md:w-52 mt-2 pt-2 border-t-2 border-gray-900">
                                    <span className="text-xs font-black text-gray-900 uppercase">Grand Total</span>
                                    <span className="text-base font-black text-[var(--color-secondary)]">₹{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center" data-html2canvas-ignore>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isGenerating}
                        className={`bg-gray-900 text-white px-8 py-3 rounded-xl text-xs font-black flex items-center gap-3 hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10 w-full md:w-auto justify-center ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isGenerating ? <>GENERATING...</> : <><Download size={16} /> DOWNLOAD INVOICE</>}
                    </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
            ` }} />
        </div>
    );
};

const OrderDetailsModal = ({ order, isOpen, onClose, onCancel, getStatusColor, formatDate }) => {
    if (!isOpen || !order) return null;

    const handleCancelClick = () => {
        const status = order.status?.toLowerCase();

        // Match backend logic: allow if not shipped/delivered/cancelled
        if (!['shipped', 'delivered', 'cancelled'].includes(status)) {
            onCancel(order._id);
        } else {
            Swal.fire({
                title: 'Cancellation Not Available',
                text: `This order cannot be cancelled because it is already ${status}.`,
                icon: 'info',
                confirmButtonColor: 'var(--color-secondary)',
                background: '#fff',
                color: '#000',
                customClass: { popup: 'rounded-[2rem]' }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 relative">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--color-secondary)]/10 p-2 rounded-xl">
                            <Package className="text-[var(--color-secondary)]" size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-900 leading-none">Order Information</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">#{order._id.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all active:scale-90">
                        <X className="text-gray-400" size={22} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-8 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black">Status</p>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${getStatusColor(order.status)} uppercase tracking-wider block w-fit shadow-sm`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black">Order Date</p>
                            <p className="text-sm text-gray-900 font-bold">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>

                    {order.status === 'cancelled' && order.cancelledAt && (
                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-red-50 rounded-2xl border border-red-100">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-wider text-red-400 font-black">Cancelled By</p>
                                <p className="text-sm text-red-900 font-bold">
                                    {order.cancelledBy === order.userId ? "You (User)" : "Admin"}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] uppercase tracking-wider text-red-400 font-black">Cancelled On</p>
                                <p className="text-sm text-red-900 font-bold">{new Date(order.cancelledAt).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 mb-4 px-1 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShoppingBag size={14} className="text-[var(--color-secondary)]" /> Items Summary
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 hover:border-[var(--color-secondary)]/30 transition-all">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                                        <img src={item.product?.mainImage?.url} alt={item.productName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.productName}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.quantity} Unit × ₹{item.productPrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 text-sm leading-none">₹{item.productPrice * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={12} className="text-[var(--color-secondary)]" /> Shipping Address
                            </h4>
                            <div className="text-xs text-gray-600 space-y-1.5 font-bold leading-relaxed">
                                <p className="text-gray-900 font-black text-sm mb-2">{order.shippingAddress?.name}</p>
                                <p>{order.shippingAddress?.addressLine1}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                                <p className="pt-2 text-[var(--color-secondary)]">{order.shippingAddress?.phone}</p>
                            </div>
                        </div>

                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard size={12} className="text-[var(--color-secondary)]" /> Billing Summary
                            </h4>
                            <div className="space-y-3">
                                <div className="space-y-1.5 text-[10px] border-b border-gray-200/60 pb-3">
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <span>SUBTOTAL</span>
                                        <span className="text-gray-900">₹{order.subtotal}</span>
                                    </div>
                                    {order.shippingCharges > 0 && (
                                        <div className="flex justify-between items-center text-gray-500 font-bold">
                                            <span>SHIPPING</span>
                                            <span className="text-gray-900">₹{order.shippingCharges}</span>
                                        </div>
                                    )}
                                    {order.handlingFee > 0 && (
                                        <div className="flex justify-between items-center text-gray-500 font-bold">
                                            <span>HANDLING</span>
                                            <span className="text-gray-900">₹{order.handlingFee}</span>
                                        </div>
                                    )}
                                    {order.discount > 0 && (
                                        <div className="flex justify-between items-center text-red-400 font-bold">
                                            <span>DISCOUNT</span>
                                            <span className="text-red-500">-₹{order.discount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-black text-xs">GRAND TOTAL</span>
                                    <span className="text-xl font-black text-zinc-900">₹{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 bg-gray-50/80 border-t border-gray-100 flex gap-3 justify-end items-center">
                    {order.status?.toLowerCase() !== 'delivered' && (
                        <button
                            onClick={handleCancelClick}
                            className="px-5 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all mr-auto uppercase tracking-wider"
                        >
                            Cancel Order
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-10 py-3 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all shadow-md active:scale-95 uppercase tracking-wider"
                    >
                        Close Details
                    </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
            `}} />
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invoiceOrder, setInvoiceOrder] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getUserOrdersApi();
            if (data && data.orders) {
                const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Cancel Order?',
            text: "Do you want to cancel this order from your history?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#111',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Cancel it',
            background: '#fff',
            color: '#000',
            borderRadius: '1.5rem'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await cancelOrderApi(orderId);
            if (res.success || res.message === "Order cancelled successfully") {
                toast.success("Order cancelled successfully");
                setIsModalOpen(false);
                fetchOrders();
            } else {
                toast.error(res.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Cancel order error:", error);
            toast.error("Something went wrong");
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const openInvoice = (order) => {
        setInvoiceOrder(order);
        setIsInvoiceModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'text-green-600 bg-green-50 border-green-100';
            case 'processing': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'shipped': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
                <Loader text="Fetching your orders..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-primary)]">
            <div className="flex-grow pt-8 pb-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/10 pb-10">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2 leading-none uppercase tracking-tight">Orders History</h1>
                            <p className="text-sm font-medium text-gray-500">Track and manage your delicious purchases</p>
                        </div>
                        <div className="bg-white px-8 py-4 rounded-3xl border border-white/5 shadow-inner">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Total Placed</p>
                            <p className="text-2xl font-black text-black leading-none">{orders.length} <span className="text-xs font-bold text-gray-400">Records</span></p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white/[0.02] rounded-3xl p-20 text-center border border-white/5">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                <ShoppingBag size={32} className="text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">No records found</h2>
                            <p className="text-gray-500 text-sm mb-10 max-w-xs mx-auto">Indulge in our authentic Sandila laddus today and start your journey!</p>
                            <button
                                onClick={() => navigate('/laddus')}
                                className="px-10 py-4 bg-[var(--color-secondary)] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-yellow-500/10"
                            >
                                Shop Laddus
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="hidden md:grid grid-cols-7 gap-4 px-10 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                <div className="col-span-2">Order Identification</div>
                                <div>Placement Date</div>
                                <div>Order Total</div>
                                <div>Status</div>
                                <div>Invoice</div>
                                <div className="text-right">Manage</div>
                            </div>

                            {orders.map((order) => (
                                <div key={order._id} className="bg-white/[0.03] rounded-[2rem] p-5 md:px-10 md:py-6 border border-white/5 hover:border-[var(--color-secondary)]/30 transition-all group shadow-sm">
                                    <div className="flex flex-col md:grid md:grid-cols-7 items-start md:items-center gap-4">
                                        <div className="w-full md:col-span-2 flex items-center gap-5">
                                            <div className="bg-white/5 w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5 shrink-0 transition-transform group-hover:scale-105">
                                                <Package size={20} className="text-[var(--color-secondary)]" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-base font-bold text-zinc-700 leading-tight">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                    {order.items.length} {order.items.length > 1 ? 'items' : 'item'}
                                                    <span className="md:hidden opacity-50"> • {formatDate(order.createdAt)}</span>
                                                </p>
                                            </div>
                                            <div className="md:hidden shrink-0">
                                                <p className="text-lg font-black text-zinc-700">₹{order.total}</p>
                                            </div>
                                        </div>

                                        <div className="hidden md:block">
                                            <p className="text-sm font-bold text-gray-400">{formatDate(order.createdAt)}</p>
                                        </div>

                                        <div className="hidden md:block">
                                            <p className="text-lg font-black text-zinc-700">₹{order.total}</p>
                                        </div>

                                        <div className="w-full md:w-auto shrink-0">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${getStatusColor(order.status)} uppercase tracking-wider block w-fit shadow-inner`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="w-full md:w-auto">
                                            <button
                                                onClick={() => openInvoice(order)}
                                                className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-zinc-100 text-zinc-600 rounded-xl font-bold text-[10px] hover:bg-zinc-200 transition-all active:scale-95 uppercase tracking-wider"
                                            >
                                                Invoice
                                            </button>
                                        </div>

                                        <div className="w-full md:block md:text-right">
                                            <button
                                                onClick={() => openOrderDetails(order)}
                                                className="flex items-center justify-center gap-2 w-full md:w-auto md:ml-auto px-6 py-3 bg-white text-black rounded-[1.2rem] font-black text-xs hover:bg-[var(--color-secondary)] transition-all shadow-md active:scale-95"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCancel={handleCancelOrder}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
            />

            <InvoiceModal
                order={invoiceOrder}
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
            />

            <Footer />
        </div>
    );
};

export default Orders;
