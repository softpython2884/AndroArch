import { useState } from 'react';

const CalculatorApp = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handlePress = (val) => {
        if (val === 'C') {
            setDisplay('0');
            setEquation('');
        } else if (val === '=') {
            try {
                // eslint-disable-next-line no-eval
                const res = eval(equation.replace('x', '*'));
                setDisplay(String(res).slice(0, 10));
                setEquation(String(res));
            } catch {
                setDisplay('Error');
            }
        } else {
            if (display === '0' && !isNaN(val)) {
                setDisplay(val);
                setEquation(val);
            } else {
                setDisplay(display + val);
                setEquation(equation + val);
            }
        }
    };

    const btnClass = "h-16 w-16 rounded-full text-2xl font-medium flex items-center justify-center transition-all active:scale-95";

    return (
        <div className="h-full flex flex-col justify-end p-6 pb-20 bg-black text-white">
            <div className="text-right text-sm px-4 text-gray-500 min-h-[20px]">{equation}</div>
            <div className="text-right text-6xl font-light mb-8 break-all px-2">{display}</div>

            <div className="grid grid-cols-4 gap-4">
                {['C', '(', ')', '/'].map(b => (
                    <button key={b} onClick={() => handlePress(b)} className={`${btnClass} bg-sub-gray text-cyan-400`}>{b}</button>
                ))}
                {['7', '8', '9', 'x'].map(b => (
                    <button key={b} onClick={() => handlePress(b)} className={`${btnClass} ${Number.isInteger(Number(b)) ? 'bg-neutral-900' : 'bg-sub-gray text-cyan-400'}`}>{b}</button>
                ))}
                {['4', '5', '6', '-'].map(b => (
                    <button key={b} onClick={() => handlePress(b)} className={`${btnClass} ${Number.isInteger(Number(b)) ? 'bg-neutral-900' : 'bg-sub-gray text-cyan-400'}`}>{b}</button>
                ))}
                {['1', '2', '3', '+'].map(b => (
                    <button key={b} onClick={() => handlePress(b)} className={`${btnClass} ${Number.isInteger(Number(b)) ? 'bg-neutral-900' : 'bg-sub-gray text-cyan-400'}`}>{b}</button>
                ))}
                {['0', '.', '=', ''].map((b, i) => (
                    b === '' ? <div key={i} /> :
                        <button key={b} onClick={() => handlePress(b)} className={`${btnClass} ${b === '=' ? 'bg-cyan-500 text-black w-full col-span-2 rounded-full !w-auto' : 'bg-neutral-900'}`}>{b}</button>
                ))}
            </div>
        </div>
    );
};

export default CalculatorApp;
