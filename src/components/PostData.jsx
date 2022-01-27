import React, { useState, useEffect } from "react";
import {
  useGetPostQuery,
  useCreatePostMutation,
  useGetOnePostQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../redux/action/postAction";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../redux/counter/counterSlice";

import { Modal, Button, Table, Container, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const PostData = () => {
  const [filterTitle, setFilterTitle] = useState("");
  const [skip, setSkip] = useState(true);
  const [id, setId] = useState(null);

  const { data, error, isLoading } = useGetPostQuery({
    filterTitle,
  });
  const { data: postOne } = useGetOnePostQuery(id, {
    skip,
  });
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [updatePost, { isLoading: isLoadingUpdate }] = useUpdatePostMutation();
  const [createPost, { isLoading: isLoadingCreate }] = useCreatePostMutation();

  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const [modalStatus, setModalStatus] = useState(false);
  const [modalTambah, setModalTambah] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (postOne) {
      setTitle(postOne?.title);
      setBody(postOne?.body);
    }
  }, [postOne]);

  useEffect(() => {
    if (isLoading || isDeleting || isLoadingUpdate || isLoadingCreate) {
      Swal.fire({
        title: "Being processed",
        html: "Please wait a moment.",
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      Swal.hideLoading();
      Swal.close();
    }
  }, [isLoading, isDeleting, isLoadingUpdate, isLoadingCreate]);

  const handleDeletePost = (idPost) => {
    let confirmAction = window.confirm("Yakin di delete ?");
    if (confirmAction) {
      setSkip(false);

      deletePost(idPost)
        .then(() => {})
        .catch((err) => console.log("ada error", err));
    }
  };

  const handleModal = (id) => {
    setId(id);
    setSkip(false);
    setModalStatus(true);
  };
  const handleModalClose = () => {
    setId(null);
    setSkip(true);
    setTitle("");
    setBody("");
    setModalStatus(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      body,
    };
    await createPost(data).unwrap();
    setModalTambah(false);
    setTitle("");
    setBody("");
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const data = {
      id: postOne?.id,
      title,
      body,
    };
    updatePost(data);
    setModalStatus(false);
    setTitle("");
    setBody("");
  };

  return (
    <>
      {error && <h1>{error}</h1>}
      <Container>
        <div className="d-flex justify-content-between mt-3">
          <h1>Data Post by {filterTitle}</h1>
          <Button variant="primary" onClick={() => setModalTambah(true)}>
            Add Post
          </Button>
        </div>
        <div className="d-flex flex-row">
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div>
      </Container>

      <Container className="mt-5">
        <div className="w-25">
          <Form.Control
            type="text"
            placeholder="Enter Title"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </div>
        <Table striped>
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Body</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              !error &&
              data.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{row.title}</td>
                  <td>{row.body}</td>
                  <td className="d-flex flex-row">
                    <Button
                      variant="danger"
                      onClick={() => handleDeletePost(row.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleModal(row.id)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={modalStatus} onHide={() => handleModalClose()}>
        <Form onSubmit={handleSubmitUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>{postOne?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Body</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleModalClose()}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={modalTambah} onHide={() => setModalTambah(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Body</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalTambah(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default PostData;
