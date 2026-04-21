import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useReportData } from './context/ReportDataContext';
import { parseReportData } from './report-data';
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
  const [pastedJson, setPastedJson] = useState('');
  const [pasteError, setPasteError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // 统一处理导入后的状态更新，供“文件上传”和“粘贴 JSON”复用。
  const applyJsonToReport = (rawText: string, sourceLabel: string, showErrorInGlobalStatus = true) => {
    try {
      const parsedJson = JSON.parse(rawText) as unknown;
      const result = parseReportData(parsedJson);

      if (!result.ok) {
        if (showErrorInGlobalStatus) {
          setImportStatus({ type: 'error', message: `JSON 格式错误：${result.message}` });
        }
        return false;
      }

      setReportData(result.data);
      const warningMessage = result.warnings[0] ? `；${result.warnings[0]}` : '';
      setImportStatus({ type: 'success', message: `${sourceLabel}导入成功${warningMessage}` });
      return true;
    } catch {
      if (showErrorInGlobalStatus) {
        setImportStatus({ type: 'error', message: 'JSON 格式错误：内容不是合法 JSON，请检查后重试。' });
      }
      return false;
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);

    try {
      const rawText = await file.text();
      setPasteError('');
      applyJsonToReport(rawText, `文件「${file.name}」`);
      event.target.value = '';
    } catch {
      setImportStatus({ type: 'error', message: 'JSON 格式错误：文件内容不是合法 JSON，请检查后重试。' });
      event.target.value = '';
    }
  };

  const handleParsePastedJson = () => {
    const trimmed = pastedJson.trim();
    if (!trimmed) {
      setPasteError('请输入 JSON 内容');
      return;
    }

    const success = applyJsonToReport(trimmed, '粘贴内容', false);
    if (success) {
      setPasteError('');
    } else {
      setPasteError('粘贴内容解析失败，请检查 JSON 格式后重试。');
    }
  };

  const handleClearPastedJson = () => {
    setPastedJson('');
    setPasteError('');
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
            <a
              className="agent-chat-btn"
              href="https://adp.cloud.tencent.com/webim_exp/#/chat/UcfXYx"
              target="_blank"
              rel="noopener noreferrer"
            >
              返回智能体
            </a>
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
            <section className="paste-json-section" aria-label="粘贴 JSON 并解析">
              <p className="paste-json-hint">若无法通过链接自动打开，可将智能体返回的 JSON 粘贴到此处直接解析。</p>
              <textarea
                className="paste-json-textarea"
                value={pastedJson}
                onChange={(event) => setPastedJson(event.target.value)}
                placeholder='请粘贴完整 JSON，例如：{"paper_title":"...","summary":"..."}'
                rows={8}
              />
              <div className="paste-json-actions">
                <button type="button" className="import-btn" onClick={handleParsePastedJson}>
                  解析粘贴的 JSON
                </button>
                <button type="button" className="import-btn" onClick={handleClearPastedJson}>
                  清空
                </button>
              </div>
              {pasteError ? <p className="status-message status-error">{pasteError}</p> : null}
            </section>
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
