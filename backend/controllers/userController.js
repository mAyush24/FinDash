const supabase = require('../services/supabaseClient');
const { updateUserSchema } = require('../utils/validators');

const getUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, status, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const { data: user, error: updateError } = await supabase
      .from('users')
      .update(value)
      .eq('id', id)
      .select('id, name, email, role, status')
      .single();

    if (updateError) throw updateError;
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account.' });
    }

    const { data: user, error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (deleteError && deleteError.code !== 'PGRST116') throw deleteError;
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUser, deleteUser };
