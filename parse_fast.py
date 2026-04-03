"""
Fast parser for DTDM PDF - no backtracking regex
"""
import json

with open('data/DTDM_practice_extracted.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Build answer map by simple string search
lines = content.split('\n')
answer_map = {}

for line in lines:
    line = line.strip()
    # Match: [Câu N] Đáp án: X
    if not line.startswith('[Câu'):
        continue
    if 'Đáp án:' not in line:
        continue
    # Extract number
    bracket_end = line.find(']')
    if bracket_end < 0:
        continue
    try:
        num_str = line[4:bracket_end].strip()
        num = int(num_str)
    except:
        continue
    
    # Extract answer
    idx = line.find('Đáp án:')
    ans_part = line[idx+7:].strip()
    # Take first letter
    if ans_part and ans_part[0] in 'ABCD':
        answer_map[num] = ans_part[0]

print(f'Answers found: {len(answer_map)}')

# Load questions
with open('data/dtdm_questions_raw.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

matched = 0
for q in questions:
    if q['id'] in answer_map:
        q['answer'] = answer_map[q['id']]
        matched += 1
    else:
        q['answer'] = 'A'

print(f'Matched: {matched}/{len(questions)}')

# Save updated
with open('data/dtdm_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print('Saved to data/dtdm_questions.json')

# Show sample
for q in questions[:3]:
    print(f"\nQ{q['id']} [{q['level']}][{q['topic']}]")
    print(f"  Q: {q['question'][:80]}")
    print(f"  A: {q['options'].get('A','')[:50]}")
    print(f"  ANS: {q['answer']}")
