import { useEffect, useMemo, useState } from 'react';
import { useReportData } from './context/ReportDataContext';
import UnifiedPageHeader from './components/UnifiedPageHeader';

const editTypeLabelMap: Record<string, string> = {
  academic_expression: '学术表达优化',
  overclaim: '结论过度外推修正',
  terminology: '术语统一',
  logic: '逻辑表达优化',
  'academic tone refinement': '学术表达优化',
  'precision enhancement': '表述精确化',
  'causal clarification': '因果论证澄清',
};

function getEditTypeLabel(editType: string): string {
  const normalized = editType.trim().toLowerCase();
  return editTypeLabelMap[normalized] ?? editType;
}

function RevisionViewerPage() {
  const { reportData } = useReportData();
  const [filterType, setFilterType] = useState('全部');
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!reportData) return;
    setExpandedMap(Object.fromEntries(reportData.revision_items.map((_, idx) => [idx, true])));
    setFilterType('全部');
  }, [reportData]);

  if (!reportData) {
    return (
      <main className="container">
        <UnifiedPageHeader
          tag="Revision Viewer"
          title="可解释润色查看器"
          subtitle="逐条理解修改逻辑，形成可迁移的学术写作规则"
        />
        <section className="panel">
          <p className="empty-state">当前没有可展示的报告数据，请先返回首页导入报告 JSON。</p>
        </section>
      </main>
    );
  }

  const allTypes = useMemo(() => {
    const types = Array.from(new Set(reportData.revision_items.map((item) => item.edit_type)));
    return ['全部', ...types];
  }, [reportData.revision_items]);

  const filteredEntries = useMemo(() => {
    const entries = reportData.revision_items.map((item, index) => ({ item, index }));
    if (filterType === '全部') return entries;
    return entries.filter((entry) => entry.item.edit_type === filterType);
  }, [reportData.revision_items, filterType]);

  const handleExpandAll = () => {
    setExpandedMap(Object.fromEntries(reportData.revision_items.map((_, idx) => [idx, true])));
  };

  const handleCollapseAll = () => {
    setExpandedMap(Object.fromEntries(reportData.revision_items.map((_, idx) => [idx, false])));
  };

  const toggleItem = (idx: number) => {
    setExpandedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main className="container">
      <UnifiedPageHeader
        tag="Revision Viewer"
        title="可解释润色查看器"
        subtitle={`论文标题：${reportData.paper_title}`}
        links={[
          { to: '/report', label: '返回智能优化报告' },
          { to: '/risk-radar', label: '科研风险雷达面板' },
          { to: '/training-lab', label: '科研规范训练场' },
        ]}
        actions={
          <div className="viewer-toolbar">
            <label htmlFor="editTypeFilter">修改类型筛选：</label>
            <select id="editTypeFilter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type === '全部' ? '全部' : editTypeLabelMap[type] ?? type}
                </option>
              ))}
            </select>
            <button type="button" className="import-btn" onClick={handleExpandAll}>
              展开全部
            </button>
            <button type="button" className="import-btn" onClick={handleCollapseAll}>
              折叠全部
            </button>
          </div>
        }
      />

      <section className="panel">
        {filteredEntries.length === 0 ? (
          <p className="empty-state">当前条件下没有可展示的润色条目。</p>
        ) : (
          <div className="revision-list">
            {filteredEntries.map(({ item, index }) => {
              const isExpanded = expandedMap[index] ?? true;
              const editTypeLabel = getEditTypeLabel(item.edit_type);

              return (
                <article key={`${item.original}-${index}`} className="revision-card">
                  <div className="card-head">
                    <h3>修改条目 {index + 1}</h3>
                    <div className="card-head-right">
                      <span className="type-pill">{editTypeLabel}</span>
                      <button type="button" className="toggle-btn" onClick={() => toggleItem(index)}>
                        {isExpanded ? '折叠' : '展开'}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <>
                      <div className="compare-grid">
                        <div className="compare-block">
                          <h4>原句</h4>
                          <p>{item.original}</p>
                        </div>
                        <div className="compare-block">
                          <h4>修改后</h4>
                          <p>{item.revised}</p>
                        </div>
                      </div>

                      <div className="revision-meta">
                        <div className="revision-meta-grid">
                          <p>
                            <strong>修改类型：</strong>
                            {editTypeLabel}
                          </p>
                          <p>
                            <strong>修改原因：</strong>
                            {item.reason}
                          </p>
                          <p>
                            <strong>可迁移规则：</strong>
                            {item.learnable_rule}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default RevisionViewerPage;
