// Your Canvas API URL
const UflUrl = 'http://127.0.0.1:5000/uflproxy/';

// Your Canvas API Token for authentication
const UFL_API_KEY =
  "1016~Ib1rAaKjrq61HmgjfpAaRRKOReFfJksW0Q7tAm79hZVIdmmjHkiWd6X2JbtHz6Mg";
// localStorage.getItem("canvas_api_key") || null;

// Function to fetch courses
async function fetchCourses() {
  const response = await fetch(`${UflUrl}api/v1/courses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UFL_API_KEY}`,
    },
  });

  return await response.json();
}

// Function to fetch assignments for a given course
/**
 * @param {any} courseId
 */
async function fetchAssignments(courseId) {
  const validAssignments = [];
  try {
    const response = await fetch(
      `${UflUrl}api/v1/courses/${courseId}/assignments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${UFL_API_KEY}`,
        },
      },
    );
    const assignments = await response.json();
    for (const assignment of assignments){
      if (assignment.submission_types.includes('online_quiz')
      ){
        assignment.html_url = `${UflUrl}courses/${courseId}/assignments/${assignment.id}/history?headless=1`;
          validAssignments.push(assignment)
      }
    }

  } catch (error) {}
  return validAssignments;
}

/**
 * @param {any} courseId
 */
async function fetchQuizzes(courseId) {
  // for one course
  const validQuizzes = [];
  try {
    const response = await fetch(
      `${UflUrl}api/v1/courses/${courseId}/quizzes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${UFL_API_KEY}`,
        },
      },
    );
    const quizzes = await response.json();

    for (const quiz of quizzes) {
      // filter out future, old, hidden, and locked quizzes
      if (
        quiz.hide_results != "always"
      ) {
        quiz.html_url = `${UflUrl}courses/${courseId}/quizzes/${quiz.id}/history?headless=1`;
        validQuizzes.push(quiz);
      }
    }
  } catch (error) {
  }
  return validQuizzes;
}

async function fetchAllAssignments() {
  // calls fetchAssignments for each course
  const courses = await fetchCourses();
  const assignments = [];
  try {
    for (const course of courses) {
      const newAssignments = await fetchAssignments(course.id);
      for (const assignment of newAssignments) {
        assignments.push(assignment);
      }
    }
  } catch (error) {}
  return assignments;
}

async function fetchAllQuizzes() {
  // calls fetchQuizzes for each course
  const courses = await fetchCourses();
  const quizzes = [];
  try {
    for (const course of courses) {
      const newQuizzes = await fetchQuizzes(course.id);

      for (const quiz of newQuizzes) {
        quizzes.push(quiz);
      }
    }
  } catch (error) {}
  return quizzes;
}

async function fetchAll() {
  // fetch all assignments and quizzes and sort by date them into one list
  const quizzes = await fetchAllQuizzes();
  const assignments = await fetchAllAssignments();
  const newList = [];
  try {
    for (const quiz of quizzes) {
      newList.push(quiz);
    }
  } catch (error) {
    console.log("no quizzes");
  }
  try {
    for (const assignment of assignments) {
      newList.push(assignment);
    }
  } catch (error) {
    console.log("no assignments");
  }

  // sort by due date here
  newList.sort(function (a, b) {
    return new Date(a.due_at) - new Date(b.due_at);
  });
  return newList;
}

/**
 * @param {any} courseId
 */
async function fetchFiles(courseId) {
  const files = [];
  try {
    const filesResponse = await fetch(
      `${UflUrl}api/v1/courses/${courseId}/files`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${UFL_API_KEY}`,
        },
      },
    );
    const filesJSON = await filesResponse.json();

    for (const file of filesJSON) {
      files.push(file);
    }
    const foldersResponse = await fetch(
      `${UflUrl}api/v1/courses/${courseId}/folders`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${UFL_API_KEY}`,
        },
      },
    );
  } catch (error) {}
  return files;
}

/**
 * @param {any} folderId
 */
async function fetchFilesByFolder(folderId) {
  const files = [];
  try {
    const response = await fetch(`${UflUrl}api/v1/folders/${folderId}/files`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${UFL_API_KEY}`,
      },
    });
    return await response.json();
  } catch (error) {}
  // return empty array if no files
  return [];
}
async function fetchAllFiles() {
  // calls fetchFiles for each course
  const courses = await fetchCourses();
  const files = [];
  try {
    for (const course of courses) {
      const response = await fetch(
        `${UflUrl}api/v1/courses/${course.id}/folders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${UFL_API_KEY}`,
          },
        },
      );
      const newFolders = await response.json();
      for (const folder of newFolders) {
        const newFiles = await fetchFilesByFolder(folder.id);
        for (const file of newFiles) {
          const ext = file.filename.substring(file.filename.length - 4);
          if (ext == ".pdf" || ext == "pptx") files.push(file);
        }
      }
    }
  } catch (error) {}
  return files;
}

fetchAll().then((data) => {
  console.log("done");
});

//export { fetchAll, fetchAllFiles};
