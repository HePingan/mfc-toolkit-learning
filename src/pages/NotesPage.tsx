import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { StudyNote, useNotes } from '../hooks/useNotes';
import { Card } from '../components/ui/Card';
import { downloadJson } from '../utils/download';

const emptyForm = { moduleId: 'overview', title: '', content: '', tags: '' };

export function NotesPage() {
  const { notes, addNote, updateNote, removeNote, clearNotes, importNotes } = useNotes();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');

  const editingNote = notes.find((note) => note.id === editingId);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return notes
      .filter((note) => moduleFilter === 'all' || note.moduleId === moduleFilter)
      .filter((note) => {
        if (!keyword) return true;
        return [note.title, note.content, note.moduleId, ...note.tags]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, query, moduleFilter]);

  const noteStats = useMemo(() => {
    const modulesWithNotes = new Set(notes.map((note) => note.moduleId)).size;
    const tagCount = new Set(notes.flatMap((note) => note.tags)).size;
    return { modulesWithNotes, tagCount };
  }, [notes]);

  const startEdit = (note: StudyNote) => {
    setEditingId(note.id);
    setForm({
      moduleId: note.moduleId,
      title: note.title,
      content: note.content,
      tags: note.tags.join('，'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveNote = () => {
    if (!form.content.trim() && !form.title.trim()) {
      setMessage('请先填写标题或内容。');
      return;
    }
    if (editingId) {
      updateNote(editingId, form);
      setMessage('笔记已更新。');
    } else {
      addNote(form);
      setMessage('笔记已保存到本地浏览器。');
    }
    resetForm();
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText) as { notes?: StudyNote[] } | StudyNote[];
      const next = Array.isArray(parsed) ? parsed : parsed.notes;
      if (!Array.isArray(next)) throw new Error('invalid notes payload');
      importNotes(next);
      setImportText('');
      setMessage('笔记导入成功。');
    } catch {
      setMessage('导入失败：JSON 格式不正确，或没有 notes 数组。');
    }
  };

  return (
    <div>
      <section className="hero">
        <div className="eyebrow">Local Notes</div>
        <h2>本地学习笔记</h2>
        <p>
          边学边记录模块重点、踩坑原因和本地 Visual Studio/MFC 实战结论。笔记仅保存在当前浏览器
          localStorage，不上传服务器。
        </p>
        <div className="badge-list">
          <span className="badge">浏览器本地保存</span>
          <span className="badge">支持导出/导入 JSON</span>
          <span className="badge">按模块和标签整理</span>
        </div>
      </section>

      <section className="stat-grid search-stats">
        <div className="stat-card">
          <strong>{notes.length}</strong>
          <span>笔记总数</span>
          <p>当前浏览器本地记录</p>
        </div>
        <div className="stat-card">
          <strong>{noteStats.modulesWithNotes}</strong>
          <span>覆盖模块</span>
          <p>已有笔记的学习模块</p>
        </div>
        <div className="stat-card">
          <strong>{noteStats.tagCount}</strong>
          <span>标签数量</span>
          <p>用于快速复习归类</p>
        </div>
      </section>

      <section className="notes-layout">
        <Card className="note-editor-card">
          <div className="section-head compact-head">
            <div>
              <div className="eyebrow">{editingNote ? 'Edit Note' : 'New Note'}</div>
              <h3>{editingNote ? `编辑：${editingNote.title}` : '新增笔记'}</h3>
            </div>
            {editingNote && (
              <button className="button button-ghost" onClick={resetForm}>
                取消编辑
              </button>
            )}
          </div>
          <div className="form-row">
            <select
              value={form.moduleId}
              onChange={(event) => setForm({ ...form, moduleId: event.target.value })}
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="笔记标题，例如：Modbus CRC 字节序"
            />
          </div>
          <textarea
            className="note-textarea"
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            placeholder="记录你对本章的理解、实验结果、常见错误、本地 MFC 实践步骤..."
          />
          <input
            value={form.tags}
            onChange={(event) => setForm({ ...form, tags: event.target.value })}
            placeholder="标签，用逗号或空格分隔，例如：串口, CRC, 常见坑"
          />
          <div className="form-row">
            <button className="button" onClick={saveNote}>
              {editingNote ? '保存修改' : '保存笔记'}
            </button>
            {message && <span className="badge">{message}</span>}
          </div>
        </Card>

        <Card className="notes-tools-card">
          <h3>筛选与备份</h3>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、内容、标签"
          />
          <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}>
            <option value="all">全部模块</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
          <div className="form-row">
            <button
              className="button button-ghost"
              onClick={() =>
                downloadJson(
                  `mfc-toolkit-notes-${Date.now()}.json`,
                  JSON.stringify({ exportedAt: new Date().toISOString(), notes }, null, 2),
                )
              }
            >
              导出笔记
            </button>
            <button
              className="button button-ghost"
              onClick={() => {
                if (confirm('确定清空所有本地笔记吗？')) clearNotes();
              }}
            >
              清空笔记
            </button>
          </div>
          <textarea
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            placeholder="粘贴之前导出的笔记 JSON"
          />
          <button className="button button-ghost" onClick={handleImport}>
            导入笔记
          </button>
        </Card>
      </section>

      <section className="notes-list">
        <div className="section-head compact-head">
          <div>
            <div className="eyebrow">Review</div>
            <h2>笔记列表</h2>
          </div>
          <span className="badge">当前显示 {filtered.length} 条</span>
        </div>
        {filtered.length === 0 ? (
          <Card className="warning-card">
            <h3>暂无匹配笔记</h3>
            <p className="muted">可以先从“串口通讯基础”或“MFC 框架入门”模块开始记录。</p>
          </Card>
        ) : (
          filtered.map((note) => {
            const module = modules.find((item) => item.id === note.moduleId);
            return (
              <Card className="note-card" key={note.id}>
                <div className="note-card-head">
                  <div>
                    <span className="badge badge-warning">{module?.title ?? note.moduleId}</span>
                    <span className="badge">更新 {new Date(note.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="form-row note-actions">
                    <Link className="button button-ghost" to={`/modules/${note.moduleId}`}>
                      回到模块
                    </Link>
                    <button className="button button-ghost" onClick={() => startEdit(note)}>
                      编辑
                    </button>
                    <button className="button button-ghost" onClick={() => removeNote(note.id)}>
                      删除
                    </button>
                  </div>
                </div>
                <h3>{note.title}</h3>
                <p className="note-content">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="badge-list">
                    {note.tags.map((tag) => (
                      <span className="badge" key={`${note.id}-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}
