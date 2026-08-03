const fs = require('fs');
const path = 'app/[locale]/courses/[slug]/ApplicationForm/page.tsx';
let c = fs.readFileSync(path, 'utf8');

console.log('File length before:', c.length);
console.log('Has bad indent block:', c.includes('     // Store course data before submission'));
console.log('Has f variable:', c.includes('const f = t.raw("fields");'));
console.log('Has LeftPanel import:', c.includes('import LeftPanel'));
console.log('Has LeftPanel usage:', c.includes('<LeftPanel />'));

// Fix 1: Remove unused f variable
c = c.replace('  const f = t.raw("fields");\n', '');

// Fix 2: Fix bad indentation on the courseId block
c = c.replace(
  `     // Store course data before submission\n  if (form.courseId && courseName) {\n    const basicCourseInfo = {\n      id: form.courseId,\n      title: courseName,\n      price: coursePrice,\n      // Add other basic info you want to preserve\n    };\n    \n    sessionStorage.setItem('lastEnrolledCourse', JSON.stringify(basicCourseInfo));\n    localStorage.setItem(\`course-\${form.courseId}\`, JSON.stringify(basicCourseInfo));\n  }\n    setIsSubmitting(true);`,
  `    // Store course data before submission\n    if (form.courseId && courseName) {\n      const basicCourseInfo = {\n        id: form.courseId,\n        title: courseName,\n        price: coursePrice,\n      };\n      sessionStorage.setItem('lastEnrolledCourse', JSON.stringify(basicCourseInfo));\n      localStorage.setItem(\`course-\${form.courseId}\`, JSON.stringify(basicCourseInfo));\n    }\n    setIsSubmitting(true);`
);

fs.writeFileSync(path, c, 'utf8');
console.log('File length after:', c.length);
console.log('Done!');
