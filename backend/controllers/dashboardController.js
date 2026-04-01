const supabase = require('../services/supabaseClient');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const { data: records, error } = await supabase
      .from('records')
      .select('*');

    if (error) throw error;

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};
    const monthlySummary = {};

    records.forEach(r => {
      const amt = Number(r.amount);
      if (r.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
      }

      // Category totals
      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }
      categoryTotals[r.category] += amt;

      // Monthly summary
      const monthYear = r.date.substring(0, 7); // YYYY-MM
      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { income: 0, expense: 0 };
      }
      if (r.type === 'income') {
        monthlySummary[monthYear].income += amt;
      } else {
        monthlySummary[monthYear].expense += amt;
      }
    });

    const netBalance = totalIncome - totalExpenses;

    // Recent 5
    const recent5 = records.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Format monthlySummary array
    const monthlySummaryArray = Object.keys(monthlySummary).sort().map(month => ({
      month,
      income: monthlySummary[month].income,
      expense: monthlySummary[month].expense
    }));

    res.json({
      success: true,
      metrics: {
        totalIncome,
        totalExpenses,
        netBalance,
        categoryTotals,
        recentTransactions: recent5,
        monthlySummary: monthlySummaryArray
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardMetrics };
