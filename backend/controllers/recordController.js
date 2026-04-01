const supabase = require('../services/supabaseClient');
const { recordSchema } = require('../utils/validators');

const createRecord = async (req, res, next) => {
  try {
    const { error, value } = recordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const userId = req.body.user_id || req.user.id;

    const { data: record, error: insertError } = await supabase
      .from('records')
      .insert([{
        user_id: userId,
        amount: value.amount,
        type: value.type,
        category: value.category,
        date: value.date,
        notes: value.notes || null
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { date, type, category, page = 1, limit = 10 } = req.query;
    let query = supabase.from('records').select('*, users(name)', { count: 'exact' });

    if (date) query = query.eq('date', date);
    if (type) query = query.eq('type', type);
    if (category) query = query.ilike('category', `%${category}%`);

    const offset = (page - 1) * limit;
    const { data: records, error: fetchError, count } = await query
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) throw fetchError;

    res.json({ success: true, records, count, page: Number(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    next(err);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = recordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const { data: record, error: updateError } = await supabase
      .from('records')
      .update({
        amount: value.amount,
        type: value.type,
        category: value.category,
        date: value.date,
        notes: value.notes || null
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    if (!record) return res.status(404).json({ success: false, error: 'Record not found.' });

    res.json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Supabase JS doesn't return the deleted row by default without select(), but if it doesn't exist it returns empty
    const { data: record, error: deleteError } = await supabase
      .from('records')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (deleteError && deleteError.code !== 'PGRST116') throw deleteError;
    if (!record) return res.status(404).json({ success: false, error: 'Record not found.' });

    res.json({ success: true, message: 'Record deleted successfully.', record });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
