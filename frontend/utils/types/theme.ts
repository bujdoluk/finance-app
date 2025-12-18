type ThemeColor
	= | 'secondary-green'
		| 'secondary-yellow'
		| 'secondary-cyan'
		| 'secondary-navy'
		| 'secondary-red'
		| 'secondary-purple'
		| 'other-pink'
		| 'other-turqoise'
		| 'other-brown'
		| 'other-magenta'
		| 'other-blue'
		| 'other-navy-gray'
		| 'other-army-green'
		| 'other-gold'
		| 'other-orange'
		| 'white'
		| 'neutral';

export const themeHexToColorNameMap: Record<string, ThemeColor> = {
	'#277C78': 'secondary-green',
	'#F2CDAC': 'secondary-yellow',
	'#82C9D7': 'secondary-cyan',
	'#626070': 'secondary-navy',
	'#C94736': 'secondary-red',
	'#826CB0': 'secondary-purple',
	'#AF81BA': 'other-pink',
	'#597C7C': 'other-turqoise',
	'#93674F': 'other-brown',
	'#934F6F': 'other-magenta',
	'#3F82B2': 'other-blue',
	'#97A0AC': 'other-navy-gray',
	'#7F9161': 'other-army-green',
	'#CAB361': 'other-gold',
	'#BE6C49': 'other-orange',
	'#FFFFFF': 'white',
};
