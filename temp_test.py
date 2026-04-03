import re
import json
import sys

def parse_answers():
    answers_db = {}
    with open('data/DTDM_answer', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # split by [Câu to handle multiline answers if any
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
            
            # clean up expl_part
            expl_part = expl_part.strip()
            if expl_part.startswith('Tại sao đúng:'):
                expl_part = expl_part[len('Tại sao đúng:'):].strip()
            
            answers_db[qid] = {
                'answers': ans_list,
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
            # We can stop or ignore that part
            block = block.split('ĐÁP ÁN & GIẢI THÍCH')[0]
            
        m = re.search(r'\[Câu (\d+)\]\s*\[Mức:\s*([^\]]+)\]\s*\[Chủ đề:\s*([^\]]+)\](?:.*?\[Điểm:[^\]]+\])?(.*?)$', block, re.DOTALL)
        if m:
            qid = int(m.group(1))
            level = m.group(2).strip()
            topic = m.group(3).strip()
            rest = m.group(4).strip()
            
            rest = re.sub(r'\(Chọn nhiều đáp án\)', '', rest).strip()
            
            # Remove formatting artifacts like --- TRANG X ---
            lines = rest.split('\n')
            clean_lines = []
            for line in lines:
                if line.startswith('--- TRANG') or line.startswith('===='):
                    continue
                clean_lines.append(line.strip())
            
            full_text = ' '.join(clean_lines)
            full_text = re.sub(r'\s+', ' ', full_text).strip()
            
            # match options using boundary
            parts = re.split(r'\s*\b([A-E])\.\s', full_text)
            
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

def main():
    ans_db = parse_answers()
    print("Parsed answers:", len(ans_db))
    q_db = parse_questions()
    print("Parsed questions:", len(q_db))
    
    # check matching
    missing_ans = []
    for q in q_db:
        if q['id'] not in ans_db:
            missing_ans.append(q['id'])
    
    print("Questions missing answers:", missing_ans)
    
if __name__ == '__main__':
    main()
