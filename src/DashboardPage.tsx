import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useReportData } from './context/ReportDataContext';
import { validateReportData } from './report-data';
import UnifiedPageHeader from './components/UnifiedPageHeader';
import './dashboard.css';

const MODULE_CARDS = [
  {
    title: '科研论文智能优化报告',
    description: '聚合展示论文总结、润色结果、风险预警与优先修改建议。',
    href: '/report',
    buttonText: '进入模块',
  },
  {
    title: '可解释润色查看器',
    description: '逐条查看原句与修改后对照，理解修改类型、原因与可迁移规则。',
    href: '/revision-viewer',
    buttonText: '进入模块',
  },
  {
    title: '科研风险雷达面板',
    description: '聚焦风险等级分布与证据片段，辅助快速定位高优先级问题。',
    href: '/risk-radar',
    buttonText: '进入模块',
  },
  {
    title: '科研规范训练场',
    description: '通过问答、案例辨析与挑战题进行学术规范训练与自测。',
    href: '/training-lab',
    buttonText: '进入模块',
  },
] as const;

function DashboardPage() {
  const { reportData, setReportData } = useReportData();
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);

    try {
      const rawText = await file.text();
      const parsedJson = JSON.parse(rawText) as unknown;
      const result = validateReportData(parsedJson);

      if (!result.ok) {
        setImportStatus({ type: 'error', message: `JSON 格式错误：${result.message}` });
        event.target.value = '';
        return;
      }

      setReportData(result.data);
      setImportStatus({ type: 'success', message: `导入成功：${file.name}` });
      event.target.value = '';
    } catch {
      setImportStatus({ type: 'error', message: 'JSON 格式错误：文件内容不是合法 JSON，请检查后重试。' });
      event.target.value = '';
    }
  };

  return (
    <main className="container">
      <UnifiedPageHeader
        tag="Zhiyan Innovation Hub"
        title="智研创新模块中心"
        subtitle="面向本科生科研训练的智能辅助模块"
        showHomeButton={false}
        links={[
          { to: '/report', label: '智能优化报告' },
          { to: '/revision-viewer', label: '润色查看器' },
          { to: '/risk-radar', label: '风险雷达' },
          { to: '/training-lab', label: '规范训练场' },
        ]}
        actions={
          <>
            <div className="import-row">
              <button type="button" className="import-btn" onClick={handleSelectFile}>
                导入报告 JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden-input"
              />
              <span className="file-name">{selectedFileName || '未导入报告数据'}</span>
            </div>
            {importStatus.type !== 'idle' ? (
              <p className={`status-message status-${importStatus.type}`}>{importStatus.message}</p>
            ) : null}
            <p className="dashboard-current-data">
              当前报告：{reportData ? reportData.paper_title : '暂无，请先导入 JSON'}
            </p>
          </>
        }
      />

      <section className="dashboard-grid" aria-label="功能模块列表">
        {MODULE_CARDS.map((card) => (
          <article key={card.title} className="dashboard-card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <Link className="dashboard-enter" to={card.href}>
              {card.buttonText}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default DashboardPage;
