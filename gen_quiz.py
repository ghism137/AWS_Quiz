"""
Generate dtdm_questions.js from parsed JSON
"""
import json, re

with open('data/dtdm_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Build topic groups
topic_map = {}
for q in questions:
    raw_topic = q.get('topic', 'General')
    # Simplify topic
    t = raw_topic
    if 'Cloud Concept' in t or 'Cloud Concept' in t:
        t_key = 'Cloud Concept'
    elif 'Compute' in t:
        t_key = 'Compute'
    elif 'Networking' in t or 'VPC' in t:
        t_key = 'Networking'
    elif 'Storage' in t:
        t_key = 'Storage'
    elif 'Security' in t or 'IAM' in t:
        t_key = 'Security & IAM'
    elif 'Database' in t:
        t_key = 'Database'
    elif 'Monitoring' in t or 'CloudWatch' in t:
        t_key = 'Monitoring'
    elif 'Architecture' in t:
        t_key = 'Architecture'
    elif 'Virtualization' in t:
        t_key = 'Virtualization'
    else:
        t_key = 'General'
    
    q['topic_group'] = t_key
    topic_map[t_key] = topic_map.get(t_key, 0) + 1

print("Topic groups:")
for t, c in sorted(topic_map.items()):
    print(f"  {t}: {c}")

# Clean and format questions for JS
output = []
for q in questions:
    # Clean question text
    qtext = q['question'].strip()
    qtext = re.sub(r'\s+', ' ', qtext)
    
    # Clean options
    opts = {}
    for k in ['A','B','C','D']:
        v = q['options'].get(k, '').strip()
        v = re.sub(r'\s+', ' ', v)
        opts[k] = v
    
    # Level label
    level = q.get('level', 'TH')
    
    out_q = {
        'id': q['id'],
        'question': qtext,
        'options': opts,
        'answer': q.get('answer', 'A'),
        'topic': q['topic_group'],
        'subtopic': q.get('topic', ''),
        'level': level
    }
    output.append(out_q)

# Write JS file
js_content = f"// DTDM Practice Test - {len(output)} câu hỏi\n"
js_content += "// Nguồn: DTDM practice test.pdf\n\n"
js_content += "const DTDM_Q = "
js_content += json.dumps(output, ensure_ascii=False, indent=2)
js_content += ";\n"

with open('data/dtdm_questions.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"\nTotal: {len(output)} questions saved to data/dtdm_questions.js")
