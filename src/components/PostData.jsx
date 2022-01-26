import React, { useState, useEffect } from "react";
import {
  useGetPostQuery,
  useGetOnePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../redux/action/postAction";

import { Modal, Button, Table, Container, Form } from "react-bootstrap";

const PostData = () => {
  const { data, error, isLoading } = useGetPostQuery();
  const [getOnePost, { data: postOne, isLoading: isLoadingOne }] =
    useGetOnePostMutation();
  const [deletePost, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeletePostMutation();
  const [updatePost, { isLoading: isLoadingUpdate, isUpdating, isSuccess }] =
    useUpdatePostMutation();

  const [modalStatus, setModalStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (postOne) {
      setTitle(postOne?.title);
      setBody(postOne?.body);
    }
  }, [postOne]);

  const handleDeletePost = (idPost) => {
    let confirmAction = window.confirm("Yakin di delete ?");
    if (confirmAction) {
      deletePost(idPost)
        .then(() => {})
        .catch((err) => console.log("ada error", err));
    }
  };

  const handleModal = (id) => {
    getOnePost(id);
    setModalStatus(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: postOne?.id,
      title,
      body,
    };
    updatePost(data);
    setModalStatus(false);
  };
  return (
    <>
      {isLoading && <h1>Loading</h1>}
      {error && <h1>{error}</h1>}
      <h1>Data Post</h1>
      <Container className="mt-5">
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

      <Modal show={modalStatus} onHide={() => setModalStatus(false)}>
        <Form onSubmit={handleSubmit}>
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
            <Button variant="secondary" onClick={() => setModalStatus(false)}>
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
