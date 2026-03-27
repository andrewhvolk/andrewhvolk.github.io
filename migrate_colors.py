import os
import re

# The mapping dictionary
COLOR_MAP = {
    'var(--primary-main)': [
        '#3498db', '#2980b9', '#1a56db', '#3b82f6', '#0d50d5',
        'var(--accent)', 'var(--primary-base)', 'var(--blue)'
    ],
    'var(--bg-base)': [
        '#f2f2f2', '#f3f4f6', '#f5f5f5', '#f8f9fa',
        'var(--bg)', 'var(--bg-body)'
    ],
    'var(--bg-surface)': [
        '#fff', '#ffffff', 'white',
        'var(--surface)', 'var(--surface2)', 'var(--card-background)'
    ],
    'var(--text-main)': [
        '#000', '#000000', '#333', '#333333', '#0f172a', '#111827',
        'var(--text)', 'var(--text-heading)', 'var(--ink-strong)'
    ],
    'var(--text-muted)': [
        '#555', '#666', '#7f8c8d', '#4b5563',
        'var(--text-muted)', 'var(--muted-text-color)'
    ],
    'var(--border-subtle)': [
        '#ddd', '#ccc', '#e2e8f0', 'rgba(0,0,0,0.1)',
        'var(--border)', 'var(--outline-variant)', 'var(--border-base)'
    ],
    'var(--emerald-main)': [
        '#22c55e', '#2ecc71', '#27ae60', '#10b981',
        'var(--green)', 'var(--emerald-deep)', 'var(--status-success)'
    ],
    'var(--danger-main)': [
        '#e74c3c', '#ff4d4d', '#dc2626', '#ff0000',
        'var(--red)', 'var(--status-error)', 'var(--review-error)'
    ],
    'var(--warning-main)': [
        '#f39c12', '#fbbf24', '#e67e22',
        'var(--amber)', 'var(--status-warning)'
    ]
}

def compile_regexes():
    """Compiles safe regex patterns to prevent partial replacements."""
    compiled_map = {}
    for new_color, old_colors in COLOR_MAP.items():
        patterns = []
        for old in old_colors:
            if old.startswith('#'):
                patterns.append(re.compile(old + r'\b', re.IGNORECASE))
            elif old.startswith('var') or old.startswith('rgba'):
                patterns.append(re.compile(re.escape(old), re.IGNORECASE))
            elif old.isalpha():
                patterns.append(re.compile(r'\b' + old + r'\b', re.IGNORECASE))
            else:
                patterns.append(re.compile(re.escape(old), re.IGNORECASE))
        compiled_map[new_color] = patterns
    return compiled_map

def process_files():
    compiled_map = compile_regexes()
    files_modified = 0
    replacements_made = 0

    for root, _, files in os.walk('.'):
        for file in files:
            if file.endswith(('.html', '.css')):
                filepath = os.path.join(root, file)
                
                try:
                    # 'r+' opens the file for reading and writing simultaneously
                    with open(filepath, 'r+', encoding='utf-8') as f:
                        content = f.read()
                        original_content = content
                        
                        # Apply all replacements
                        for new_color, patterns in compiled_map.items():
                            for pattern in patterns:
                                content, count = pattern.subn(new_color, content)
                                replacements_made += count

                        # Save if changes were made
                        if content != original_content:
                            f.seek(0)        # Move cursor back to the start
                            f.write(content) # Overwrite with the newly updated text
                            f.truncate()     # Chop off any leftover data at the end
                            
                            print(f"Updated: {filepath}")
                            files_modified += 1

                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

    print("-" * 30)
    print(f"Done! Modified {files_modified} files.")
    print(f"Total color replacements made: {replacements_made}")

if __name__ == "__main__":
    print("Starting CSS/HTML color migration (OneDrive-Safe Mode)...")
    process_files()