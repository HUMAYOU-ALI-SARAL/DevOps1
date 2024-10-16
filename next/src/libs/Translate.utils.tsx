// conversionUtils.ts
export function engToArabicAlphanumeric(input: string): string {
  const latinToArabicMap: { [key: string]: string } = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    'A': 'ا',
    'B': 'ب',
    'C': 'ج',
    'D': 'د',
    'E': 'هـ',
    'F': 'ف',
    'G': 'ج',
    'H': 'هـ',
    'I': 'ي',
    'J': 'ج',
    'K': 'ك',
    'L': 'ل',
    'M': 'م',
    'N': 'ن',
    'O': 'و',
    'P': 'ب',
    'Q': 'ق',
    'R': 'ر',
    'S': 'س',
    'T': 'ت',
    'U': 'و',
    'V': 'ف',
    'W': 'و',
    'X': 'إكس',
    'Y': 'ي',
    'Z': 'ز',
  };

  return input.split('').map(char => latinToArabicMap[char.toUpperCase()] || char).join('');
}
