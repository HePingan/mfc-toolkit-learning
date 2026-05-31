import { useMemo, useState } from 'react';
import {
  TroubleCategory,
  TroubleCase,
  scoreTroubleAnswer,
  troubleCases,
  troubleCategoryLabels,
} from '../../data/troubleshooting';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type CaseTrainerProps = {
  item: TroubleCase;
};

export function TroubleCaseTrainer({ item }: CaseTrainerProps) {
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = submitted && scoreTroubleAnswer(item, selected);
  const wrong = submitted && selected && !correct;

  return (
    <Card className="trouble-case-card">
      <div className="trouble-case-head">
        <div>
          <div className="eyebrow">{troubleCategoryLabels[item.category]}</div>
          <h3>{item.title}</h3>
        </div>
        <span className="badge">{item.tags.join(' / ')}</span>
      </div>
      <p className="lead trouble-scene">{item.scene}</p>

      <div className="trouble-grid">
        <div>
          <h4>现场症状</h4>
          <ul>
            {item.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>已有证据</h4>
          <ul>
            {item.evidence.map((evidence) => (
              <li key={evidence}>{evidence}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="trouble-options">
        <h4>请选择最可能的根因</h4>
        {item.options.map((option) => {
          const isAnswer = submitted && option === item.answer;
          const isWrong = submitted && option === selected && option !== item.answer;
          return (
            <label
              className={`${isAnswer ? 'option-correct' : ''} ${isWrong ? 'option-wrong' : ''}`}
              key={option}
            >
              <input
                type="radio"
                name={item.id}
                checked={selected === option}
                onChange={() => setSelected(option)}
              />{' '}
              {option}
            </label>
          );
        })}
      </div>

      <div className="form-row action-row">
        <Button onClick={() => setSubmitted(true)} disabled={!selected}>
          提交诊断
        </Button>
        {submitted && (
          <span className={`badge ${correct ? 'badge-success' : 'badge-warning'}`}>
            {correct ? '诊断正确' : '继续复盘证据'}
          </span>
        )}
      </div>

      {submitted && (
        <div className={`trouble-result ${wrong ? 'wrong' : 'correct'}`}>
          <h4>诊断结论：{item.answer}</h4>
          <p>{item.diagnosis}</p>
          <h4>修复步骤</h4>
          <ol>
            {item.fixSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="warning-text">
            <strong>本地实战：</strong>
            {item.localPractice}
          </div>
        </div>
      )}
    </Card>
  );
}

export function TroubleCategoryMatrix({
  active,
  onSelect,
}: {
  active: TroubleCategory | 'all';
  onSelect: (category: TroubleCategory | 'all') => void;
}) {
  const counts = useMemo(
    () =>
      troubleCases.reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + 1;
        return acc;
      }, {}),
    [],
  );
  const entries: Array<TroubleCategory | 'all'> = [
    'all',
    'serial',
    'tcp',
    'http',
    'mfc',
    'cpp',
    'storage',
  ];
  return (
    <Card className="trouble-matrix-card">
      <div className="diagram-head compact-head">
        <div>
          <div className="eyebrow">Troubleshooting Matrix</div>
          <h3>故障排查训练矩阵</h3>
        </div>
        <span className="badge">{troubleCases.length} 个现场案例</span>
      </div>
      <div className="trouble-category-grid">
        {entries.map((entry) => (
          <button
            className={active === entry ? 'active' : ''}
            type="button"
            onClick={() => onSelect(entry)}
            key={entry}
          >
            <strong>{entry === 'all' ? '全部案例' : troubleCategoryLabels[entry]}</strong>
            <span>{entry === 'all' ? troubleCases.length : (counts[entry] ?? 0)} 个案例</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
