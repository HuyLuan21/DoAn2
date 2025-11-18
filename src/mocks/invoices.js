export default [
    {
        invoiceId: 1,
        enrollmentId: 1,
        discountAmount: 0,
        finalAmount: 1500000,
        status: 'Paid', // Paid, Unpaid, Overdue, cancelled
        paymentDate: '2025-06-10',
    },
    {
        invoiceId: 2,
        enrollmentId: 2,
        discountAmount: 200000,
        finalAmount: 1300000,
        status: 'Unpaid',
        paymentDate: null,
    },
    {
        invoiceId: 3,
        enrollmentId: 3,
        discountAmount: 0,
        finalAmount: 1500000,
        status: 'Paid',
        paymentDate: '2025-06-15',
    },
]
