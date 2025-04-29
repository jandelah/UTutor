// test-supabase.js
const { supabase } = require('./config/supabase');

async function testConnection() {
    const { data, count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('Connection error:', error);
  } else {
    console.log('Row count:', count);
  }
  
}

testConnection();