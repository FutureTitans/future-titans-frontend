'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  Brain, TrendingUp, Users, ArrowRight, Star, Quote,
  ChevronRight, Download, Play, Pause, Activity
} from 'lucide-react';

// Deterministic seed data for 20 students over 6 weeks
const generateSimulationData = () => {
  const students = [];
  const firstNames = ['Aarav', 'Riya', 'Vihaan', 'Ananya', 'Ishaan', 'Diya', 'Arjun', 'Myra', 'Sai', 'Kavya', 'Krishna', 'Sara', 'Dhruv', 'Suhana', 'Kabir', 'Aditi', 'Rudra', 'Nysa', 'Ayan', 'Pari'];
  const schools = ['DPS Jaipur', 'DAV Chandigarh', 'Kendriya Vidyalaya Pune', 'CMS Lucknow', 'Bhavans Kochi'];

  for (let i = 0; i < 20; i++) {
    const startSSI = 25 + Math.floor(Math.random() * 20); // 25-45
    const endSSI = 65 + Math.floor(Math.random() * 25); // 65-90

    // Generate an S-curve progression
    const weeklyData = [];
    let currentSSI = startSSI;

    for (let week = 0; week <= 6; week++) {
      if (week === 0) {
        weeklyData.push(currentSSI);
      } else if (week === 6) {
        weeklyData.push(endSSI);
      } else {
        // Logistic-ish growth: slow start, fast middle, tapering end
        const progress = week / 6;
        const sCurve = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        const projectedSSI = Math.round(startSSI + (endSSI - startSSI) * sCurve);
        // Add slight randomness
        const jitter = Math.floor(Math.random() * 5) - 2;
        currentSSI = Math.max(currentSSI, projectedSSI + jitter);
        weeklyData.push(currentSSI);
      }
    }

    students.push({
      id: `std-${i}`,
      name: firstNames[i],
      school: schools[i % schools.length],
      tier: 'Tier 2',
      class: 'Class 9',
      startSSI: startSSI,
      endSSI: endSSI,
      growth: endSSI - startSSI,
      weeklyProgress: weeklyData,
      finalSurge: {
        spot: Math.min(100, endSSI + Math.floor(Math.random() * 15) - 5),
        unbundle: Math.min(100, endSSI + Math.floor(Math.random() * 15) - 5),
        reframe: Math.min(100, endSSI + Math.floor(Math.random() * 20) - 10),
        generate: Math.min(100, endSSI + Math.floor(Math.random() * 20) - 10),
        evaluate: Math.min(100, endSSI + Math.floor(Math.random() * 15) - 5)
      }
    });
  }

  return students.sort((a, b) => b.growth - a.growth);
};

const MOCK_DATA = generateSimulationData();

// Calculate aggregate weekly averages
const getCohortAverages = () => {
  const averages = [];
  for (let week = 0; week <= 6; week++) {
    const sum = MOCK_DATA.reduce((acc, student) => acc + student.weeklyProgress[week], 0);
    averages.push({
      week: \`Week \${week}\`,
      average: Math.round(sum / MOCK_DATA.length)
    });
  }
  return averages;
};

const COHORT_AVERAGES = getCohortAverages();

export default function GrantSimulationPage() {
  const [selectedStudent, setSelectedStudent] = useState(MOCK_DATA[0]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentAnimationWeek, setCurrentAnimationWeek] = useState(6);
  
  useEffect(() => {
    if (!isAnimating) return;
    
    setCurrentAnimationWeek(0);
    const interval = setInterval(() => {
      setCurrentAnimationWeek(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsAnimating(false);
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  const cohortStart = COHORT_AVERAGES[0].average;
  const cohortEnd = COHORT_AVERAGES[6].average;

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              SSI Score: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F5EDD6] text-gray-900 p-4 md:p-8 font-sans pb-24">
      {/* Header for Presentation */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#B8952E] font-bold text-xs uppercase tracking-widest mb-4">
            <Activity className="w-4 h-4" />
            Zunnova™ AI Simulation
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-2">
            SSI™ <span className="font-bold">Progression Model</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Proof of Concept: 6-week cognitive restructuring simulation for 20 Class 9 students from Tier 2 schools.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAnimating(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:shadow-md transition-all"
          >
            <Play className="w-4 h-4" /> Replay Timeline
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all shadow-lg">
            <Download className="w-4 h-4" /> Export Deck
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Macro Impact */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Cohort Average</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-gray-900">{cohortEnd}</span>
                <span className="text-lg font-medium text-gray-400 mb-1 line-through">{cohortStart}</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                <TrendingUp className="w-4 h-4" /> +{cohortEnd - cohortStart} pts
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8952E] rounded-3xl p-6 shadow-lg text-white flex flex-col justify-center">
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">Iteration Depth</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">3.2x</span>
              </div>
              <p className="mt-4 text-sm font-medium text-white/90 leading-tight">
                Increase in continuous problem-solving cycles before asking for help.
              </p>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 shadow-lg text-white flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Cognitive Shift</p>
              <div className="space-y-3 mt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Reframing Ability</span>
                    <span className="text-[#F5D76E] font-bold">↑ 2.4x</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-[#D4AF37] h-1.5 rounded-full w-[80%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Persistence</span>
                    <span className="text-[#F5D76E] font-bold">↑ 2.8x</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-[#D4AF37] h-1.5 rounded-full w-[90%]"></div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cohort SSI™ Growth Trajectory</h2>
                <p className="text-sm text-gray-500">6-week S.U.R.G.E. interaction data</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                  <span className="text-sm font-medium text-gray-600">Cohort Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-medium text-gray-600">Individual Student</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="week" 
                    type="category" 
                    allowDuplicatedCategory={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dx={-10}
                  />
                  
                  {/* Render individual faint lines */}
                  {MOCK_DATA.map((student) => {
                    // Limit data based on animation frame
                    const animatedData = student.weeklyProgress.slice(0, currentAnimationWeek + 1).map((val, i) => ({
                      week: \`Week \${i}\`,
                      value: val
                    }));
                    
                    return (
                      <Line 
                        key={student.id}
                        data={animatedData}
                        dataKey="value"
                        stroke={selectedStudent.id === student.id ? '#111827' : '#f3f4f6'}
                        strokeWidth={selectedStudent.id === student.id ? 3 : 1.5}
                        dot={selectedStudent.id === student.id ? { r: 5, fill: '#111827', strokeWidth: 0 } : false}
                        activeDot={false}
                        isAnimationActive={false}
                      />
                    );
                  })}
                  
                  {/* Render bold average line */}
                  <Line 
                    data={COHORT_AVERAGES.slice(0, currentAnimationWeek + 1)} 
                    dataKey="average" 
                    stroke="#D4AF37" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#D4AF37', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#D4AF37' }}
                    isAnimationActive={false}
                  />
                  
                  <RechartsTooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Week slider/indicator */}
            <div className="mt-8 flex items-center justify-between px-10">
              {[0,1,2,3,4,5,6].map(week => (
                <div key={week} className="flex flex-col items-center gap-2">
                  <div className={\`w-3 h-3 rounded-full transition-all duration-300 \${
                    week <= currentAnimationWeek ? 'bg-[#D4AF37] scale-125' : 'bg-gray-200'
                  }\`}></div>
                </div>
              ))}
            </div>
            <div className="relative mt-[-6px] px-10 z-[-1]">
              <div className="w-full h-0.5 bg-gray-100">
                <div 
                  className="h-full bg-[#D4AF37] transition-all duration-300 ease-linear" 
                  style={{ width: \`\${(currentAnimationWeek / 6) * 100}%\` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Quotes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <Quote className="absolute -top-4 -left-4 w-24 h-24 text-gray-50 opacity-50" />
              <div className="relative z-10">
                <div className="flex gap-1 text-[#D4AF37] mb-4">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-gray-700 italic font-medium leading-relaxed mb-6">
                  "Before Zunnova, students would stop at 'I don't know where to start.' By week 4, they were actively breaking down massive problems into 3-4 specific root causes. The cognitive shift is visible."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">SR</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Sunita R.</p>
                    <p className="text-xs text-gray-500 font-medium">Principal, Pilot School</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#D4AF37]" /> Behavioral Pivot Points
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✘</div>
                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Week 1:</span> "I can't build an app, I don't know how to code."</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✔</div>
                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Week 6:</span> "I used WhatsApp to prototype the service and got 3 users today."</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Micro View (Individual Drill Down) */}
        <div className="space-y-6">
          
          <div className="bg-gray-900 rounded-3xl p-1 shadow-lg text-white">
            <div className="bg-[#1A1A1A] rounded-[22px] p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Cohort Roster</h3>
              
              <div className="space-y-2 h-[300px] overflow-y-auto pr-2 custom-scrollbar-dark">
                {MOCK_DATA.map((student, idx) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={\`w-full text-left flex items-center justify-between p-3 rounded-2xl transition-all \${
                      selectedStudent.id === student.id 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-md' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold \${
                        selectedStudent.id === student.id ? 'bg-white/20' : 'bg-gray-800'
                      }\`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">{student.name}</p>
                        <p className="text-[10px] opacity-80">{student.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{student.weeklyProgress[currentAnimationWeek]}</p>
                      <p className="text-[10px] opacity-80">SSI</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student Deep Dive */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-1">{selectedStudent.name}'s Profile</h3>
            <p className="text-xs text-gray-500 mb-6">{selectedStudent.tier} • {selectedStudent.class}</p>

            <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-2xl">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Week 0</p>
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.startSSI}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Week {currentAnimationWeek}</p>
                <p className="text-3xl font-bold text-[#D4AF37]">{selectedStudent.weeklyProgress[currentAnimationWeek]}</p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">S.U.R.G.E.™ Breakdown</h4>
            
            <div className="space-y-4">
              {[
                { label: 'Spot', full: 'Spot & Shift', value: selectedStudent.finalSurge.spot },
                { label: 'Unbundle', full: 'Unbundle & Understand', value: selectedStudent.finalSurge.unbundle },
                { label: 'Reframe', full: 'Reframe & Run', value: selectedStudent.finalSurge.reframe },
                { label: 'Generate', full: 'Generate & Go', value: selectedStudent.finalSurge.generate },
                { label: 'Evaluate', full: 'Evaluate & Empower', value: selectedStudent.finalSurge.evaluate },
              ].map((dim) => {
                // Adjust visualization based on animation time
                const displayValue = currentAnimationWeek === 6 ? dim.value : Math.floor(selectedStudent.startSSI + ((dim.value - selectedStudent.startSSI) * (currentAnimationWeek/6)));
                
                return (
                  <div key={dim.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-gray-700">{dim.full}</span>
                      <span className="font-bold text-gray-900">{displayValue}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all duration-500"
                        style={{ width: \`\${displayValue}%\` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      
      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: \`
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      \`}} />
    </div>
  );
}
