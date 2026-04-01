import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, Filter } from 'lucide-react';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, amount: '', type: 'expense', category: '', date: '', notes: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [page, typeFilter, dateFilter]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let url = `/records?page=${page}&limit=10`;
      if (typeFilter) url += `&type=${typeFilter}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (dateFilter) url += `&date=${dateFilter}`;
      
      const res = await axios.get(url);
      if (res.data.success) {
        setRecords(res.data.records);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleClearFilters = () => {
    setCategoryFilter('');
    setTypeFilter('');
    setDateFilter('');
    setPage(1);
  };
  
  useEffect(() => {
    if(categoryFilter === '') {
      fetchRecords();
    }
    // eslint-disable-next-line
  }, [categoryFilter]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    // Remove "id" before sending since our Joi schema strict-validates it
    const { id, ...payload } = formData;
    
    try {
      if (id) {
        await axios.put(`/records/${id}`, payload);
      } else {
        await axios.post('/records', payload);
      }
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving record');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      id: record.id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date.substring(0, 10),
      notes: record.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/records/${id}`);
        fetchRecords();
      } catch (err) {
        alert(err.response?.data?.error || 'Error deleting record');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Records</h1>
        <button 
          onClick={() => {
            setFormData({ id: null, amount: '', type: 'expense', category: '', date: '', notes: '' });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add Record'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 animate-[fadeIn_0.3s_ease-out]">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{formData.id ? 'Edit' : 'New'} Record</h2>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" required value={formData.type} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" step="0.01" name="amount" required value={formData.amount} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" name="category" required value={formData.category} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" required value={formData.date} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" rows="2"></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end pt-2">
              <button disabled={formLoading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm transition-all text-sm disabled:opacity-70">
                {formLoading ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="text-gray-500 font-medium text-sm flex items-center gap-2"><Filter size={16}/> Filters</div>
        <form onSubmit={handleFilterSubmit} className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-4 py-2 border rounded-xl text-sm bg-gray-50 outline-none flex-1 max-w-[150px]" aria-label="Filter by Date" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 border rounded-xl text-sm bg-gray-50 outline-none flex-1">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="text" placeholder="Category Search" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-2 border rounded-xl text-sm bg-gray-50 outline-none flex-1" />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors">Apply</button>
          <button type="button" onClick={handleClearFilters} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Clear</button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.users?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{record.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      ${Number(record.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(record)} className="text-gray-400 hover:text-blue-600 mx-2 transition-colors" title="Edit">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(record.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {records.length === 0 && (
              <div className="p-8 text-center text-gray-500">No records found.</div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded-xl bg-white text-sm font-medium disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600 font-medium">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded-xl bg-white text-sm font-medium disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Records;
