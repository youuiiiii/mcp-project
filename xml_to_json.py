import json
import xml.etree.ElementTree as ET
import argparse
import sys

def get_all_text(element):
    """
    Recursively extracts all text within an XML element and its children.
    """
    text = element.text or ""
    for child in element:
        text += get_all_text(child)
        if child.tail:
            text += child.tail
    return text

def get_dialogue_text(p_element, speaker_element):
    """
    Extracts dialogue text by getting all text following the speaker tag
    inside a paragraph element.
    """
    text_parts = []
    if speaker_element.tail:
        text_parts.append(speaker_element.tail)
    
    found_speaker = False
    for child in p_element:
        if found_speaker:
            text_parts.append(get_all_text(child))
            if child.tail:
                text_parts.append(child.tail)
        elif child == speaker_element:
            found_speaker = True
            
    return "".join(text_parts).strip()

def convert_xml_to_json(xml_content):
    """
    Parses the custom XML content and converts it into a list of dictionaries
    representing either "narrative" or "dialog" entries.
    """
    xml_content = xml_content.strip()
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError as e:
        # Try wrapping in a root <doc> tag if the input is a fragment
        try:
            root = ET.fromstring(f"<doc>{xml_content}</doc>")
        except ET.ParseError:
            raise ValueError(f"Failed to parse XML: {e}")

    result = []
    
    # Locate all <p> elements at any depth
    for p in root.findall('.//p'):
        speaker_el = p.find('speaker')
        if speaker_el is not None:
            # Extract and clean up speaker name (removing trailing colon and whitespace)
            speaker_name = get_all_text(speaker_el).strip().rstrip(':').strip()
            dialogue_text = get_dialogue_text(p, speaker_el)
            result.append({
                "type": "dialog",
                "speaker": speaker_name,
                "text": dialogue_text
            })
        else:
            text = get_all_text(p).strip()
            if text:  # Only add non-empty paragraphs
                result.append({
                    "type": "narrative",
                    "text": text
                })
    return result

def main():
    parser = argparse.ArgumentParser(description="Convert custom XML to JSON format.")
    parser.add_argument("input_file", help="Path to the input XML file (use '-' for standard input)")
    parser.add_argument("output_file", nargs="?", default=None, help="Path to the output JSON file (optional, writes to stdout if omitted)")
    
    args = parser.parse_args()
    
    try:
        if args.input_file == '-':
            xml_content = sys.stdin.read()
        else:
            with open(args.input_file, 'r', encoding='utf-8') as f:
                xml_content = f.read()
        
        data = convert_xml_to_json(xml_content)
        
        json_output = json.dumps(data, indent=2, ensure_ascii=False)
        
        if args.output_file:
            with open(args.output_file, 'w', encoding='utf-8') as f:
                f.write(json_output)
            print(f"Successfully converted and saved to: {args.output_file}")
        else:
            print(json_output)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
