import { useMemo, useState } from 'react';
import { useReportData } from './context/ReportDataContext';
import UnifiedPageHeader from './components/UnifiedPageHeader';

type RiskFilter = 'all' | 'high' | 'medium' | 'low';

function normalizeSeverity(value: string): RiskFilter | 'unknown' {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high' || value === '高') return 'high';
  if (normalized === 'medium' || value === '中') return 'medium';
  if (normalized === 'low' || value === '低') return 'low';
  return 'unknown';
}

function severityText(value: string): string {
  const normalized = normalizeSeverity(value);
  if (normalized === 'high') return '高';
  if (normalized === 'medium') return '中';
  if (normalized === 'low') return '低';
  return value || '未知';
}

function App() {
  const { reportData: data } = useReportData();
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [revisionExpanded, setRevisionExpanded] = useState(true);

  const editTypeLabelMap: Record<string, string> = {
    'Academic tone refinement': '学术表达优化',
    'Precision enhancement': '表述精确化',
    'Causal clarification': '因果论证澄清',
  };

  if (!data) {
    return (
      <main className="container">
        <UnifiedPageHeader
          tag="Paper Optimization Report"
          title="科研论文智能优化报告"
          subtitle="聚合呈现摘要、润色、风险与优先行动，支持比赛答辩展示"
        />
        <section className="panel">
          <p className="empty-state">当前没有可展示的报告数据，请先返回首页导入报告 JSON。</p>
        </section>
      </main>
    );
  }

  const highRiskCount = data.risk_items.filter((risk) => normalizeSeverity(risk.severity) === 'high').length;
  const mediumRiskCount = data.risk_items.filter((risk) => normalizeSeverity(risk.severity) === 'medium').length;
  const overviewStatus = highRiskCount > 0 ? '需重点修订' : '整体可提交（建议优化）';
  const topPriority = data.priority_actions[0] ?? '暂无';
  const filteredRiskItems = useMemo(() => {
    if (riskFilter === 'all') return data.risk_items;
    return data.risk_items.filter((risk) => normalizeSeverity(risk.severity) === riskFilter);
  }, [data.risk_items, riskFilter]);

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = data.paper_title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 50) || 'report';
    link.href = url;
    link.download = `${safeName}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="container">
      <UnifiedPageHeader
        tag="Paper Optimization Report"
        title={data.paper_title}
        subtitle="科研论文智能优化报告：从问题诊断到修订建议的一体化展示"
        links={[
          { to: '/revision-viewer', label: '可解释润色查看器' },
          { to: '/risk-radar', label: '科研风险雷达面板' },
          { to: '/training-lab', label: '科研规范训练场' },
        ]}
        actions={
          <div className="import-row">
            <button type="button" className="import-btn" onClick={handleExportJson}>
              导出当前报告 JSON
            </button>
            <button type="button" className="import-btn" onClick={handlePrint}>
              打印当前报告
            </button>
            <span className="file-name">当前数据来自全局报告：{data.paper_title}</span>
          </div>
        }
      />

      <section className="panel">
        <h2>总体评估</h2>
        <p>{data.summary}</p>
      </section>

      <section className="panel">
        <h2>报告总览</h2>
        <div className="overview-grid">
          <article className="overview-item">
            <h3>总体状态</h3>
            <p>{overviewStatus}</p>
          </article>
          <article className="overview-item">
            <h3>高风险问题数</h3>
            <p>{highRiskCount}</p>
          </article>
          <article className="overview-item">
            <h3>中风险问题数</h3>
            <p>{mediumRiskCount}</p>
          </article>
          <article className="overview-item">
            <h3>优先处理建议</h3>
            <p>{topPriority}</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>润色后文本</h2>
        <p className="polished">{data.polished_text}</p>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>修改理由清单</h2>
          <button type="button" className="import-btn" onClick={() => setRevisionExpanded((prev) => !prev)}>
            {revisionExpanded ? '一键折叠' : '一键展开'}
          </button>
        </div>
        {revisionExpanded ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>原句</th>
                  <th>修改后</th>
                  <th>修改类型</th>
                  <th>修改理由</th>
                  <th>可迁移规则</th>
                </tr>
              </thead>
              <tbody>
                {data.revision_items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.original}</td>
                    <td>{item.revised}</td>
                    <td>{editTypeLabelMap[item.edit_type] ?? item.edit_type}</td>
                    <td>{item.reason}</td>
                    <td>{item.learnable_rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>科研风险预警</h2>
          <div className="filter-group" role="group" aria-label="风险筛选">
            <button
              type="button"
              className={`import-btn ${riskFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setRiskFilter('all')}
            >
              全部
            </button>
            <button
              type="button"
              className={`import-btn ${riskFilter === 'high' ? 'is-active' : ''}`}
              onClick={() => setRiskFilter('high')}
            >
              高风险
            </button>
            <button
              type="button"
              className={`import-btn ${riskFilter === 'medium' ? 'is-active' : ''}`}
              onClick={() => setRiskFilter('medium')}
            >
              中风险
            </button>
            <button
              type="button"
              className={`import-btn ${riskFilter === 'low' ? 'is-active' : ''}`}
              onClick={() => setRiskFilter('low')}
            >
              低风险
            </button>
          </div>
        </div>
        <div className="risk-grid">
          {filteredRiskItems.map((risk, idx) => (
            <article key={idx} className="risk-card">
              <div className="risk-head">
                <h3>{risk.title}</h3>
                <span className={`severity severity-${normalizeSeverity(risk.severity)}`}>{severityText(risk.severity)}</span>
              </div>
              <p>
                <strong>证据片段：</strong> {risk.evidence_text}
              </p>
              <p>
                <strong>问题说明：</strong> {risk.explanation}
              </p>
              <p>
                <strong>修改建议：</strong> {risk.suggestion}
              </p>
            </article>
          ))}
        </div>
        {filteredRiskItems.length === 0 ? <p className="empty-state">当前筛选条件下暂无风险项。</p> : null}
      </section>

      <section className="panel">
        <h2>优先修改建议</h2>
        <ol>
          {data.priority_actions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export default App;
