export interface ReportTemplateData {
  householdName: string;
  members: string[];
  totalNetWorth: number;
  accounts: {
    id: string;
    accountType: string;
    custodian: string;
    balance: number;
  }[];
  holdings: {
    ticker: string;
    name: string;
    assetClass: string;
    quantity: number;
    costBasis: number;
    totalValue: number;
  }[];
  allocation: {
    equity: number;
    bond: number;
    cash: number;
    alternative: number;
  };
  riskProfile?: {
    score: number;
    category: string;
  };
  generatedDate: string;
  asOfDate: string;
}

export function generateReportHtml(data: ReportTemplateData): string {
  const accountRows = data.accounts
    .map(
      (a) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${a.accountType.toUpperCase()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${a.custodian}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">
          $${a.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>`,
    )
    .join('');

  const holdingRows = data.holdings
    .slice(0, 15)
    .map(
      (h) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${h.ticker}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${h.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${h.assetClass.toUpperCase()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${h.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${h.costBasis.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">
          $${h.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nexgile WealthAgent Client Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 40px; background-color: #f8fafc; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 32px; margin-bottom: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px; }
    .title { font-size: 28px; font-weight: 700; margin: 16px 0 8px 0; }
    .subtitle { color: #64748b; font-size: 14px; }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .metric-box { background: #f1f5f9; padding: 16px; border-radius: 8px; }
    .metric-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .metric-val { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
    th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #cbd5e1; color: #475569; font-weight: 600; }
    .disclaimer { font-size: 11px; color: #94a3b8; line-height: 1.5; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="logo">NEXGILE WEALTHAGENT</div>
        <div class="subtitle">Institutional Wealth Management & Advisory Services</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 600;">Confidential Portfolio Review</div>
        <div class="subtitle">As of: ${data.asOfDate}</div>
      </div>
    </div>

    <div class="title">${data.householdName}</div>
    <div class="subtitle">Prepared for: ${data.members.join(', ')} • Generated on: ${data.generatedDate}</div>

    <div class="metrics">
      <div class="metric-box">
        <div class="metric-label">Total Net Worth</div>
        <div class="metric-val">$${data.totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Risk Profile</div>
        <div class="metric-val" style="text-transform: capitalize;">${data.riskProfile?.category || 'Moderate'} (${data.riskProfile?.score || 55}/100)</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Equity Allocation</div>
        <div class="metric-val">${data.allocation.equity}%</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Fixed Income / Cash</div>
        <div class="metric-val">${(data.allocation.bond + data.allocation.cash).toFixed(1)}%</div>
      </div>
    </div>

    <h3 style="margin-top: 32px; font-size: 18px;">Account Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Account Type</th>
          <th>Custodian</th>
          <th style="text-align: right;">Current Balance</th>
        </tr>
      </thead>
      <tbody>
        ${accountRows}
      </tbody>
    </table>

    <h3 style="margin-top: 32px; font-size: 18px;">Top Portfolio Holdings</h3>
    <table>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Security Name</th>
          <th>Asset Class</th>
          <th style="text-align: right;">Qty</th>
          <th style="text-align: right;">Cost Basis</th>
          <th style="text-align: right;">Market Value</th>
        </tr>
      </thead>
      <tbody>
        ${holdingRows}
      </tbody>
    </table>

    <div class="disclaimer">
      <strong>Important Regulatory Disclosure:</strong> This statement is generated for informational and planning purposes only. Valuations are calculated based on custodian feeds and internal price records as of the date shown. Past performance is no guarantee of future returns. Investments are subject to market risks, including the possible loss of principal. Tax and estate suggestions should be reviewed with your independent certified public accountant or legal counsel.
    </div>
  </div>
</body>
</html>
  `;
}
