import React, { useState, useEffect } from 'react';
import { getUserOrdersApi, cancelOrderApi } from '../../api/order';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle2, 
  Eye, 
  X, 
  Clock, 
  Info, 
  Printer, 
  Download,
  Truck,
  Home,
  Phone,
  Mail,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Footer from '../../components/layout/Footer';
import Loader from '../../components/common/Loader';
import logo from '../../assets/images/logo.png';

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
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
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
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 relative">
                <div id="printable-invoice" className="flex flex-col flex-1 overflow-hidden bg-white">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Tax Invoice</h2>
                                    <p className="text-xs text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        {/* Bill From / To */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">From</p>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 text-sm">SKS Laddu</p>
                                    <p className="text-xs text-gray-500">Ahirawan, Sandila, Hardoi</p>
                                    <p className="text-xs text-gray-500">Uttar Pradesh - 241204</p>
                                    <p className="text-xs text-gray-500">+91 8467831372</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">To</p>
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 text-sm">{order.shippingAddress?.name}</p>
                                    <p className="text-xs text-gray-500">{order.shippingAddress?.addressLine1}</p>
                                    {order.shippingAddress?.addressLine2 && <p className="text-xs text-gray-500">{order.shippingAddress?.addressLine2}</p>}
                                    <p className="text-xs text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                                    <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Invoice Date</p>
                                <p className="text-sm font-semibold text-gray-900">{today}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Payment Method</p>
                                <p className="text-sm font-semibold text-gray-900">{order.paymentMethod || 'COD'}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-[10px] font-bold text-gray-400 uppercase">Item</th>
                                        <th className="text-center py-3 text-[10px] font-bold text-gray-400 uppercase">Qty</th>
                                        <th className="text-right py-3 text-[10px] font-bold text-gray-400 uppercase">Price</th>
                                        <th className="text-right py-3 text-[10px] font-bold text-gray-400 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-50">
                                            <td className="py-3 text-gray-800 font-medium">{item.productName}</td>
                                            <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                            <td className="py-3 text-right text-gray-600">₹{item.productPrice}</td>
                                            <td className="py-3 text-right font-bold text-gray-900">₹{item.productPrice * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-gray-900">₹{order.subtotal}</span>
                                    </div>
                                    {order.shippingCharges > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Shipping</span>
                                            <span className="font-medium text-gray-900">₹{order.shippingCharges}</span>
                                        </div>
                                    )}
                                    {order.handlingFee > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Handling Fee</span>
                                            <span className="font-medium text-gray-900">₹{order.handlingFee}</span>
                                        </div>
                                    )}
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-red-500">Discount</span>
                                            <span className="font-medium text-red-500">-₹{order.discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="font-bold text-gray-900">Grand Total</span>
                                        <span className="text-xl font-bold text-yellow-600">₹{order.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400">Thank you for shopping with SKS Laddu! ❤️</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Download size={16} />
                        )}
                        Download Invoice
                    </button>
                </div>
            </div>
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
        const order = orders.find(o => o._id === orderId);
        if (order?.status?.toLowerCase() === 'delivered') {
            toast.error("Delivered orders cannot be cancelled.", { position: "top-right" });
            return;
        }

        const result = await Swal.fire({
            title: 'Cancel Order?',
            text: "Are you sure you want to cancel this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, Keep it',
            background: '#ffffff',
            color: '#111827',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await cancelOrderApi(orderId);
            if (res.success || res.message === "Order cancelled successfully") {
                toast.success("Order cancelled successfully", { position: "top-right" });
                setIsModalOpen(false);
                fetchOrders();
            } else {
                toast.error(res.message || "Failed to cancel order", { position: "top-right" });
            }
        } catch (error) {
            console.error("Cancel order error:", error);
            toast.error("Something went wrong", { position: "top-right" });
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
        const s = status?.toLowerCase();
        if (s === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
        if (s === 'shipped') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (s === 'processing') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        if (s === 'confirmed') return 'bg-purple-100 text-purple-700 border-purple-200';
        if (s === 'cancelled') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return <CheckCircle2 size={14} />;
        if (s === 'shipped') return <Truck size={14} />;
        if (s === 'processing') return <Clock size={14} />;
        if (s === 'cancelled') return <X size={14} />;
        return <Package size={14} />;
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader text="Fetching your orders..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and manage all your purchases</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                            You haven't placed any orders yet. Start exploring our delicious laddus!
                        </p>
                        <button
                            onClick={() => navigate('/laddus')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all shadow-md"
                        >
                            Shop Now <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <Package size={18} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Calendar size={12} className="text-gray-400" />
                                                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                        <button
                                            onClick={() => openInvoice(order)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5"
                                            title="Download Invoice"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-5">
                                    {/* Items Preview */}
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100">
                                                    <img 
                                                        src={item.product?.mainImage?.url} 
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-800 line-clamp-1 max-w-[120px]">{item.productName}</p>
                                                    <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-3 py-2">
                                                <p className="text-xs text-gray-500">+{order.items.length - 3} more</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Shipping & Total */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-gray-400" />
                                                <p className="text-xs text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard size={14} className="text-gray-400" />
                                                <p className="text-xs text-gray-600">{order.paymentMethod || 'COD'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase">Total Amount</p>
                                                <p className="text-xl font-bold text-gray-900">₹{order.total}</p>
                                            </div>
                                            <button
                                                onClick={() => openOrderDetails(order)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-all"
                                            >
                                                View Details <Eye size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full mt-10 max-w-xl rounded-xl shadow-2xl overflow-hidden max-h-[75vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                                <p className="text-xs text-gray-500">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl border ${selectedOrder.status?.toLowerCase() === 'cancelled' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selectedOrder.status?.toLowerCase() === 'cancelled' ? 'bg-red-100' : 'bg-white'}`}>
                                        {selectedOrder.status?.toLowerCase() === 'delivered' ? <CheckCircle2 className="text-green-600" size={20} /> :
                                         selectedOrder.status?.toLowerCase() === 'cancelled' ? <X className="text-red-600" size={20} /> :
                                         <Package className="text-yellow-600" size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Order {selectedOrder.status}</p>
                                        <p className="text-xs text-gray-500">
                                            {selectedOrder.status?.toLowerCase() === 'delivered' ? 'Your order has been delivered successfully!' :
                                             selectedOrder.status?.toLowerCase() === 'cancelled' ? `Cancelled on ${new Date(selectedOrder.cancelledAt).toLocaleDateString()}` :
                                             'Your order is being processed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <ShoppingBag size={16} className="text-gray-500" /> Items
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-100">
                                                <img src={item.product?.mainImage?.url} alt={item.productName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.productName}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.productPrice}</p>
                                            </div>
                                            <p className="font-bold text-gray-900">₹{item.productPrice * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-500" /> Shipping Address
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="font-medium text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{selectedOrder.shippingAddress?.addressLine1}</p>
                                    {selectedOrder.shippingAddress?.addressLine2 && <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.addressLine2}</p>}
                                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                                    <p className="text-sm text-gray-600 mt-2">{selectedOrder.shippingAddress?.phone}</p>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard size={16} className="text-gray-500" /> Payment Summary
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">₹{selectedOrder.subtotal}</span>
                                    </div>
                                    {selectedOrder.shippingCharges > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping Charges</span>
                                            <span className="font-medium text-gray-900">₹{selectedOrder.shippingCharges}</span>
                                        </div>
                                    )}
                                    {selectedOrder.handlingFee > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Handling Fee</span>
                                            <span className="font-medium text-gray-900">₹{selectedOrder.handlingFee}</span>
                                        </div>
                                    )}
                                    {selectedOrder.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-red-600">Discount</span>
                                            <span className="font-medium text-red-600">-₹{selectedOrder.discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-yellow-600">₹{selectedOrder.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            {selectedOrder.status?.toLowerCase() !== 'delivered' && selectedOrder.status?.toLowerCase() !== 'cancelled' && (
                                <button
                                    onClick={() => handleCancelOrder(selectedOrder._id)}
                                    className="px-4 py-2 text-red-600 font-medium text-sm hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <button
                                    onClick={() => openInvoice(selectedOrder)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <Download size={14} /> Invoice
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-xl hover:bg-black transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Modal */}
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