import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  BookOpen,
  Calendar,
  Star,
  Sparkles,
  Clock,
  Users,
  Download,
  Eye,
  Heart,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectsFoldersPage() {
  const [subjects, setSubjects] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedExams, setExpandedExams] = useState({});
  const [examsBySubject, setExamsBySubject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`https://exampro-app.onrender.com/api/SubjectCategory`);
        const data = await response.json();
        setSubjects(data);
      } catch (err) {
        console.error("שגיאה בשליפת מקצועות:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const toggleSubjectFolder = async (subjectId) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
    if (!examsBySubject[subjectId]) {
      try {
        const response = await fetch(`https://exampro-app.onrender.com/api/Exam/by-subject?subjectId=${subjectId}`);
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setExamsBySubject((prev) => ({ ...prev, [subjectId]: sorted }));
      } catch (err) {
        console.error("שגיאה בטעינת מבחנים:", err);
      }
    }
  };

  const toggleExam = (examId) => {
    setExpandedExams((prev) => ({ ...prev, [examId]: !prev[examId] }));
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("he-IL", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4" dir="rtl">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0), radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur opacity-25"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 mb-4"
              >
                <div className="relative">
                  <Sparkles className="w-12 h-12 text-blue-600" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  מערכת יצירת מבחנים חכמה
                </h1>
              </motion.div>
              <p className="text-slate-600 text-lg font-medium">ניהול מתקדם של מקצועות, מבחנים וקבצים במערכת אחת חכמה</p>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">AI מתקדם</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">ממשק מהיר</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-600">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">חוויה מושלמת</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-8">
            {subjects.map((subject, index) => {
              const exams = examsBySubject[subject.id] || [];
              const isExpanded = expandedSubjects[subject.id];
              
              return (
                <motion.div
                  key={subject.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      animate={isExpanded ? { opacity: 0.3 } : {}}
                    />
                    
                    {/* Main Card */}
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                      {/* Subject Header */}
                      <motion.div
                        onClick={() => toggleSubjectFolder(subject.id)}
                        className="cursor-pointer relative overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
                        <div className="relative p-6 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <motion.div
                              animate={{ rotate: isExpanded ? 360 : 0 }}
                              transition={{ duration: 0.5 }}
                              className="relative"
                            >
                              {isExpanded ? (
                                <FolderOpen className="w-8 h-8 text-blue-600" />
                              ) : (
                                <Folder className="w-8 h-8 text-blue-600" />
                              )}
                              <motion.div
                                className="absolute -inset-1 bg-blue-500/20 rounded-full"
                                animate={isExpanded ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                            <div>
                              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                                {subject.name}
                              </h2>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {exams.length} מבחנים
                                </span>
                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  עודכן לאחרונה
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3"
                          >
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                              {exams.length > 0 ? `${exams.length} מבחנים` : 'ריק'}
                            </div>
                            <ChevronLeft className="w-6 h-6 text-slate-600" />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Exams Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 bg-gradient-to-b from-slate-50/50 to-white">
                              {exams.length === 0 ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-center py-12"
                                >
                                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-blue-500" />
                                  </div>
                                  <p className="text-slate-500 font-medium text-lg">אין מבחנים זמינים במקצוע זה</p>
                                  <p className="text-slate-400 text-sm mt-2">התחל ליצור מבחן חדש כדי לראות אותו כאן</p>
                                </motion.div>
                              ) : (
                                <div className="grid gap-4">
                                  {exams.map((exam, examIndex) => (
                                    <ExamCard
                                      key={exam.id}
                                      exam={exam}
                                      isExpanded={expandedExams[exam.id]}
                                      onToggle={() => toggleExam(exam.id)}
                                      formatDate={formatDate}
                                      index={examIndex}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ExamCard({ exam, isExpanded, onToggle, formatDate, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        />
        
        <div className="relative bg-white rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
          <motion.div
            onClick={onToggle}
            className="cursor-pointer p-5 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 transition-all duration-300"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: isExpanded ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {isExpanded ? (
                    <FolderOpen className="w-6 h-6 text-rose-500" />
                  ) : (
                    <Folder className="w-6 h-6 text-rose-500" />
                  )}
                </motion.div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {formatDate(exam.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">
                    {exam.title || "מבחן ללא שם"}
                  </h3>
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30"
              >
                <div className="p-6 pt-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    {exam.studyMaterialUrls?.length > 0 && (
                      <FileLinks 
                        title="חומרי לימוד" 
                        urls={exam.studyMaterialUrls} 
                        icon={BookOpen} 
                        gradientFrom="from-blue-500" 
                        gradientTo="to-cyan-500"
                        bgGradient="from-blue-50 to-cyan-50"
                      />
                    )}
                    {exam.examFileUrls?.length > 0 && (
                      <FileLinks 
                        title="קבצי מבחן" 
                        urls={exam.examFileUrls} 
                        icon={FileText} 
                        gradientFrom="from-rose-500" 
                        gradientTo="to-pink-500"
                        bgGradient="from-rose-50 to-pink-50"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function FileLinks({ title, urls, icon: Icon, gradientFrom, gradientTo, bgGradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-4 border border-white/50 shadow-sm`}
    >
      <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
        <Icon className={`w-5 h-5 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded p-1`} />
        {title}
      </h4>
      <div className="space-y-2">
        {urls.map((url, index) => (
          <motion.a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-3 bg-white/70 hover:bg-white rounded-lg transition-all duration-300 hover:shadow-md border border-white/50"
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-8 h-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center shadow-sm`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-slate-700 font-medium group-hover:text-slate-900">
                קובץ {index + 1}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Eye className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">לחץ לצפייה</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50"
        >
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/3" />
                <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-3/4" />
              <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/2" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}