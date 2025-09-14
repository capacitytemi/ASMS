import React, { useState, useMemo } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import Modal from './Modal';
import type { FeeRecord, StatCardData, Student, Payment } from '../types';
import { CashIcon, UsersIcon, PrinterIcon } from '../constants';
import { Role } from '../App';
import { allStudents, allFeeRecords, LOGGED_IN_STUDENT_ID } from './data';

type Theme = 'light' | 'dark';
interface FeesProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    onMenuClick: () => void;
    onLogout: () => void;
}

const statusColors = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-400/50',
    Unpaid: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-400/50',
    Partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-400/50',
};

const Fees: React.FC<FeesProps> = ({ theme, toggleTheme, activeRole, onMenuClick, onLogout }) => {
    const [feeRecords, setFeeRecords] = useState(allFeeRecords);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    
    const isStudentOrParent = activeRole === 'Student' || activeRole === 'Parent';

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

    const displayedRecords = useMemo(() => {
        if (isStudentOrParent) {
            return feeRecords.filter(r => r.studentId === LOGGED_IN_STUDENT_ID);
        }
        return feeRecords;
    }, [feeRecords, isStudentOrParent]);

    const feeStats = useMemo((): StatCardData[] => {
        const recordsToStat = isStudentOrParent ? displayedRecords : feeRecords;
        const totalCollectable = recordsToStat.reduce((sum, r) => sum + r.totalFees, 0);
        const totalPaid = recordsToStat.reduce((sum, r) => sum + r.amountPaid, 0);
        const totalOutstanding = totalCollectable - totalPaid;

        if (isStudentOrParent) {
            return [
                { title: 'Total Fees', value: formatCurrency(totalCollectable), change: 'Current Term', changeType: 'increase', icon: <CashIcon className="w-6 h-6"/> },
                { title: 'Amount Paid', value: formatCurrency(totalPaid), change: 'Up to date', changeType: 'increase', icon: <UsersIcon className="w-6 h-6" /> },
                { title: 'Outstanding Balance', value: formatCurrency(totalOutstanding), change: totalOutstanding > 0 ? 'Due' : 'Cleared', changeType: totalOutstanding > 0 ? 'decrease' : 'increase', icon: <UsersIcon className="w-6 h-6" /> },
            ];
        }

        return [
            { title: 'Total Collectable', value: formatCurrency(totalCollectable), change: 'Current Term', changeType: 'increase', icon: <CashIcon className="w-6 h-6"/> },
            { title: 'Total Paid', value: formatCurrency(totalPaid), change: `${totalCollectable > 0 ? ((totalPaid / totalCollectable) * 100).toFixed(1) : 0}%`, changeType: 'increase', icon: <UsersIcon className="w-6 h-6" /> },
            { title: 'Total Outstanding', value: formatCurrency(totalOutstanding), change: `${totalCollectable > 0 ? ((totalOutstanding / totalCollectable) * 100).toFixed(1) : 0}%`, changeType: 'decrease', icon: <UsersIcon className="w-6 h-6" /> },
        ];
    }, [feeRecords, isStudentOrParent, displayedRecords]);
    
    const handleOpenPaymentModal = (record: FeeRecord) => {
        setSelectedRecord(record);
        setPaymentAmount(record.balance);
        setPaymentModalOpen(true);
    }
    
    const handleRecordPayment = () => {
        if (!selectedRecord || paymentAmount <= 0) return;

        setFeeRecords(prevRecords => prevRecords.map(rec => {
            if (rec.id === selectedRecord.id) {
                const newAmountPaid = rec.amountPaid + paymentAmount;
                const newBalance = rec.totalFees - newAmountPaid;
                const newStatus: FeeRecord['status'] = newBalance <= 0 ? 'Paid' : 'Partial';
                const newPayment: Payment = {
                    id: `P${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    amount: paymentAmount,
                    receiptNumber: `RCPT-${Math.floor(Math.random() * 1000)}`
                };

                return { ...rec, amountPaid: newAmountPaid, balance: newBalance, status: newStatus, paymentHistory: [...rec.paymentHistory, newPayment] };
            }
            return rec;
        }));

        setPaymentModalOpen(false);
        setSelectedRecord(null);
        setPaymentAmount(0);
    }
    
    const handleViewDetails = (record: FeeRecord) => {
        setSelectedRecord(record);
        setDetailsModalOpen(true);
    }

    const handlePrintReceipt = () => {
      const printContents = document.getElementById("receipt-content")!.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = `<div class="p-8">${printContents}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
    };

    const getStudentName = (studentId: string) => allStudents.find(s => s.id === studentId)?.name || 'Unknown';
    const getStudentClass = (studentId: string) => allStudents.find(s => s.id === studentId)?.class || 'N/A';
    
    const title = isStudentOrParent ? (activeRole === 'Parent' ? "My Child's Fee Status" : "My Fee Status") : "Fee Management (Junior Secondary)";

    return (
        <>
            <Header title={title} theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} onMenuClick={onMenuClick} onLogout={onLogout} />
            
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isStudentOrParent ? 'xl:grid-cols-3' : 'xl:grid-cols-3'}`}>
                {feeStats.map((data) => (
                    <StatCard key={data.title} data={data} />
                ))}
            </div>

            <div className="mt-8 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="p-4 sm:p-6 border-b border-border dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">{isStudentOrParent ? "My Payment History" : "Student Fee Records"}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                {!isStudentOrParent && <th scope="col" className="px-6 py-3">Class</th>}
                                <th scope="col" className="px-6 py-3 text-right">Balance</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRecords.map((record) => (
                                <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{getStudentName(record.studentId)}</th>
                                    {!isStudentOrParent && <td className="px-6 py-4">{getStudentClass(record.studentId)}</td>}
                                    <td className={`px-6 py-4 text-right font-semibold ${record.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>{formatCurrency(record.balance)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[record.status]}`}>{record.status}</span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2 text-center">
                                        <button onClick={() => handleViewDetails(record)} className="font-medium text-primary dark:text-blue-400 hover:underline">View</button>
                                        {activeRole === 'Accountant' && record.status !== 'Paid' && <button onClick={() => handleOpenPaymentModal(record)} className="font-medium text-secondary dark:text-green-400 hover:underline">Pay</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Payment Modal */}
            <Modal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} title={`Record Payment for ${getStudentName(selectedRecord?.studentId || '')}`}>
                <div className='space-y-4'>
                    <div>
                        <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount to Pay</label>
                        <input type="number" id="paymentAmount" value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} className="w-full p-2 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setPaymentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                        <button onClick={handleRecordPayment} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">Confirm Payment</button>
                    </div>
                </div>
            </Modal>
            
            {/* Payment Details Modal */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} title={`Payment Details for ${getStudentName(selectedRecord?.studentId || '')}`}>
              {selectedRecord && (
                <div id="receipt-container">
                  <div id="receipt-content" className="space-y-4">
                    <div className="p-4 border-b dark:border-gray-600">
                      <h3 className="text-lg font-bold text-primary">{getStudentName(selectedRecord.studentId)}</h3>
                      <p className="text-sm text-text-secondary dark:text-gray-400">{getStudentClass(selectedRecord.studentId)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-4">
                        <div><span className="font-semibold">Total Fees:</span> {formatCurrency(selectedRecord.totalFees)}</div>
                        <div className="text-green-600"><span className="font-semibold">Paid:</span> {formatCurrency(selectedRecord.amountPaid)}</div>
                        <div className="text-red-600"><span className="font-semibold">Balance:</span> {formatCurrency(selectedRecord.balance)}</div>
                    </div>
                    <h4 className="px-4 pt-2 text-md font-semibold">Payment History</h4>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Receipt #</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRecord.paymentHistory.map(p => (
                                <tr key={p.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2">{p.date}</td>
                                    <td className="px-4 py-2">{p.receiptNumber}</td>
                                    <td className="px-4 py-2 text-right">{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                            {selectedRecord.paymentHistory.length === 0 && (
                                <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-500">No payments recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end px-4 pt-4 mt-4 border-t dark:border-gray-600">
                      <button onClick={handlePrintReceipt} className="flex items-center px-4 py-2 space-x-2 text-white rounded-lg bg-secondary hover:bg-green-600">
                          <PrinterIcon className="w-5 h-5"/>
                          <span>Print Receipt</span>
                      </button>
                  </div>
                </div>
              )}
            </Modal>
        </>
    );
};

export default Fees;
