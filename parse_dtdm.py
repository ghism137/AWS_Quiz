import json
import re
import os

def parse_answers():
    answers_db = {}
    with open('data/DTDM_answer', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Parse standard format: [Câu X] Đáp án: A ✔ Tại sao đúng: ...
    blocks = re.split(r'(?=\[Câu \d+\] Đáp án:)', content)
    for block in blocks:
        block = block.strip()
        if not block.startswith('[Câu '): continue
        if '✔' not in block: continue
        
        ans_part, expl_part = block.split('✔', 1)
        m = re.search(r'\[Câu (\d+)\] Đáp án:\s*([A-E, ]+)', ans_part)
        if m:
            qid = int(m.group(1))
            raw_ans = m.group(2)
            ans_list = [x.strip() for x in raw_ans.split(',') if x.strip()]
            
            expl_part = expl_part.strip()
            if expl_part.startswith('Tại sao đúng:'):
                expl_part = expl_part[len('Tại sao đúng:'):].strip()
            
            answers_db[qid] = {
                'answer': ans_list,
                'explanation': expl_part
            }
            
    # 2. Parse special format: C226 - A: Đổi từ mua đứt ...
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if 'C' in line and '-' in line and ':' in line:
            #  C226 - A: ...
            m = re.search(r'C(\d+)\s*-\s*([A-E, ]+):\s*(.*)', line)
            if m:
                qid = int(m.group(1))
                raw_ans = m.group(2)
                ans_list = [x.strip() for x in raw_ans.split(',') if x.strip()]
                expl_part = m.group(3).strip()
                answers_db[qid] = {
                    'answer': ans_list,
                    'explanation': expl_part
                }
                
    return answers_db

def parse_questions():
    with open('data/DTDM_quizze_ques.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        
    blocks = re.split(r'(?=\[Câu \d+\]\s*\[Mức:)', content)
    questions = []
    
    for block in blocks:
        block = block.strip()
        if not block.startswith('[Câu '): continue
        if 'ĐÁP ÁN & GIẢI THÍCH' in block:
            block = block.split('ĐÁP ÁN & GIẢI THÍCH')[0]
            
        m = re.search(r'\[Câu (\d+)\]\s*\[Mức:\s*([^\]]+)\]\s*\[Chủ đề:\s*([^\]]+)\](?:.*?\[Điểm:[^\]]+\])?(.*?)$', block, re.DOTALL)
        if m:
            qid = int(m.group(1))
            level = m.group(2).strip()
            topic = m.group(3).strip()
            rest = m.group(4).strip()
            
            rest = re.sub(r'\(Chọn nhiều đáp án\)', '', rest).strip()
            
            # Clean lines
            lines = rest.split('\n')
            clean_lines = []
            for line in lines:
                if line.startswith('--- TRANG') or line.startswith('===='):
                    continue
                clean_lines.append(line.strip())
            
            full_text = ' '.join(clean_lines)
            full_text = re.sub(r'\s+', ' ', full_text).strip()
            
            # Parse A. B. C. D. E.
            parts = re.split(r'\s*\b([A-E])\.\s', full_text)
            
            if len(parts) > 1:
                q_text = parts[0].strip()
                opts = {}
                for i in range(1, len(parts)-1, 2):
                    opts[parts[i]] = parts[i+1].strip()
                    
                questions.append({
                    'id': qid,
                    'level': level,
                    'topic': topic,
                    'question': q_text,
                    'options': opts
                })
            
    return questions

def map_topic_group(topic):
    t = topic
    if 'Cloud Concept' in t: return 'Cloud Concept'
    if 'Compute' in t: return 'Compute'
    if 'Networking' in t or 'VPC' in t: return 'Networking'
    if 'Storage' in t: return 'Storage'
    if 'Security' in t or 'IAM' in t: return 'Security & IAM'
    if 'Database' in t: return 'Database'
    if 'Monitoring' in t or 'CloudWatch' in t: return 'Monitoring'
    if 'Architecture' in t: return 'Architecture'
    if 'Virtualization' in t: return 'Virtualization'
    if 'Global Infrastructure' in t: return 'Global Infrastructure'
    return 'General'

def main():
    ans_db = parse_answers()
    q_db = parse_questions()
    
    # Sort
    q_db.sort(key=lambda x: x['id'])
    
    final_questions = []
    
    for q in q_db:
        qid = q['id']
        ans_info = ans_db.get(qid)
        
        answers = ans_info['answer'] if ans_info else ["A"]
        explanation = ans_info['explanation'] if ans_info else ""
        
        # Determine topic group
        topic_group = map_topic_group(q['topic'])
        
        final_questions.append({
            'id': qid,
            'question': q['question'],
            'options': q['options'],
            'answer': answers,            # Array of strings
            'explanation': explanation,   # String explanation
            'topic': topic_group,
            'subtopic': q['topic'],
            'level': q['level']
        })
        
    print(f"Total parsed questions: {len(final_questions)}")
    
    # Check if there are missing answers
    missing = [q['id'] for q in final_questions if q['id'] not in ans_db]
    if missing:
        print(f"WARNING: Missing answers for {len(missing)} questions: {missing}")

    # Output JSON raw
    with open('data/dtdm_questions_raw.json', 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, ensure_ascii=False, indent=2)

    # Output JS
    js_content = f"// DTDM Practice Test - {len(final_questions)} câu hỏi\n"
    js_content += "// Nguồn: DTDM practice test.pdf\n\n"
    js_content += "const DTDM_Q = "
    js_content += json.dumps(final_questions, ensure_ascii=False, indent=2)
    js_content += ";\n"

    with open('data/dtdm_questions.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("Successfully generated data/dtdm_questions_raw.json and data/dtdm_questions.js")

if __name__ == '__main__':
    main()
