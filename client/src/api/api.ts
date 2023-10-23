const ServerUrl = "http://127.0.0.1:8080/";
const UflUrl = `${ServerUrl}ufl.instructure.com/`;
const UFL_API_KEY = localStorage.getItem("canvas_api_key") || "noApiKey";
const OPENAI_API_KEY = localStorage.getItem("openai_api_key") || "noApiKey";
const PINECONE_API_KEY = localStorage.getItem("pinecone_api_key") || "noApiKey";

async function fetchCourses() {
  try {
    const response = await fetch(`${UflUrl}api/v1/courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${UFL_API_KEY}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function fetchAssignmentHtml(htmlUrl: string) {
  try {
    const response = await fetch(`${ServerUrl}${htmlUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${UFL_API_KEY}`,
      },
    });
    return await response.text();
  } catch (error) {
    console.log(error);
  }
}

async function fetchAnnouncements(courseId: number) {
  // returns list of pure announcement strings (no objects)
  try {
    const response = await fetch(
      `${UflUrl}api/v1/announcements?context_codes[]=course_${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${UFL_API_KEY}`,
        },
      },
    );
    const temp = await response.json();
    const announcements = [];
    for (var i = 0; i < announcements.length; i++) {
      announcements.push(temp[i].message.replace(/<[^>]*>/g, ""));
    }
    return announcements;
  } catch (error) {
    console.log(error);
  }
}

async function fetchAssignments(courseId: number) {
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
    console.log(assignments);
    for (const assignment of assignments) {
      if (assignment.submission_types.includes("online_quiz")) {
        const url = new URL(assignment.submissions_download_url);
        const paths = url.pathname.split("/");
        const courseNum = paths[2];
        const quizNum = paths[4];
        assignment.html_url = `https://ufl.instructure.com/courses/${courseNum}/quizzes/${quizNum}/history?headless=1`;
        validAssignments.push(assignment);
      }
    }
  } catch (error) {}
  return validAssignments;
}

async function fetchCourseTasks(courseId: number) {
  try {
    const assignments = await fetchAssignments(courseId);
    const quizzes = await fetchQuizzes(courseId);
    const tasks = [...assignments, ...quizzes];

    tasks.sort(function (a, b) {
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    });

    return tasks;
  } catch (error) {
    console.log(error);
  }
}

async function fetchQuizzes(courseId: number) {
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
      if (quiz.hide_results != "always") {
        quiz.html_url = `${UflUrl}courses/${courseId}/quizzes/${quiz.id}/history?headless=1`;
        validQuizzes.push(quiz);
      }
    }
  } catch (error) {}
  return validQuizzes;
}

async function fetchCourseFiles(courseId: number) {
  const files = [];
  try {
    const response = await fetch(
      `${UflUrl}api/v1/courses/${courseId}/folders`,
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
  } catch (error) {}
  return files;
}

async function fetchFilesByFolder(folderId: number) {
  try {
    const response = await fetch(`${UflUrl}api/v1/folders/${folderId}/files`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${UFL_API_KEY}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return []; // return empty array if no files or error occurs
  }
}

async function fetchCourse(courseId: number) {
  try {
    const tasks = await fetchCourseTasks(courseId);
    const files = await fetchCourseFiles(courseId);
    return { tasks, files };
  } catch (error) {
    console.log(error);
  }
}

async function fetchAll() {
  try {
    const courses = await fetchCourses();
    const allData = [];

    for (const course of courses) {
      const courseData = await fetchCourse(course.id);
      allData.push(courseData);
    }

    return allData;
  } catch (error) {
    console.log(error);
  }
}

export {
  fetchCourses,
  fetchCourseTasks,
  fetchCourseFiles,
  fetchAll,
  fetchAnnouncements,
  fetchAssignmentHtml,
};
