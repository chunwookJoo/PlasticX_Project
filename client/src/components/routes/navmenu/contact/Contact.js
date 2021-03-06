import React, { useState } from "react";
import axios from "axios";

import "./Contact.css";

function Contact(props) {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Message, setMessage] = useState("");
  const [Subject, setSubject] = useState("");

  const onNameChange = (event) => {
    setName(event.currentTarget.value);
  };

  const onEmailChange = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onSubjectChange = (event) => {
    setSubject(event.currentTarget.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.currentTarget.value);
  };

  let body = {
    name: Name,
    email: Email,
    subject: Subject,
    message: Message,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(body);
    axios({
      method: "POST",
      url: "/api/contact",
      data: body,
    }).then((response) => {
      if (response.data.status === "success") {
        alert("이메일이 성공적으로 전송되었습니다.");
        resetForm();
      } else if (response.data.status === "fail") {
        alert("이메일 전송 실패.");
      } else alert(response.data.status);
    });
  };

  function resetForm() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <section className="contact-page">
      <div className="page-header">
        <h2>문의하기</h2>
        <hr></hr>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>To. PlasticX</label>
        <div className="inquires">
          <input
            type="name"
            id="name"
            placeholder="이름"
            required
            value={Name}
            onChange={onNameChange}
          ></input>
          <input
            type="email"
            id="email"
            placeholder="이메일"
            required
            value={Email}
            onChange={onEmailChange}
          ></input>
          <input
            type="subject"
            id="subject"
            placeholder="제목"
            required
            value={Subject}
            onChange={onSubjectChange}
          ></input>
          <textarea
            id="message"
            placeholder="문의하실 내용을 적어주세요."
            value={Message}
            onChange={onMessageChange}
          ></textarea>
          <button type="submit">Send Message</button>
        </div>
      </form>
    </section>
  );
}

export default Contact;
