const bcrypt = require('bcryptjs');
const supabase = require('../services/supabaseClient');

async function seedAdmin() {
  const name = 'Admin User';
  const email = 'admin@finance.com';
  const password = 'adminpassword123';
  
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password_hash,
        role: 'admin',
        status: 'active'
      }])
      .select('id, name, email, role')
      .single();
      
    if (error) {
      if (error.code === '23505') {
        console.log('Admin user already exists!');
      } else {
        console.error('Error seeding admin:', error);
      }
    } else {
      console.log('Admin user seeded successfully:', newUser);
    }
  } catch (err) {
    console.error('Exception seeding admin:', err);
  }
}

seedAdmin();
