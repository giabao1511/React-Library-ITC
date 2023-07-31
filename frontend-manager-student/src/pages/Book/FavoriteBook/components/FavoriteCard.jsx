//! LIBRARY
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

//! SHARE
import HELPERS from 'utils/helper';

//! COMPONENT
import InputNumber from 'components/InputNumber';
import { Get_All_Favorite_Initial } from 'redux/student/favorite_slice/favorite_thunk';

const FavoriteCard = ({ idx, book }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  // console.log(quantity);

  const handleBorrowBook = () => {
    HELPERS.handleBorrowBook(book, quantity, dispatch);
  };

  const handleDeleteFavorite = (favorite_book_id) => {
    HELPERS.handleDeleteFavoriteBook(favorite_book_id, dispatch).then(() => {
      dispatch(Get_All_Favorite_Initial());
    });
  };

  return (
    <div className="book__list__item" key={idx}>
      <div className="book__list__item__name flex-name">
        <Link to={`/book/${book.book_id}`}>{book.name_book}</Link>
        <i className="bx bx-trash" onClick={() => handleDeleteFavorite(book.favorite_book_id)}></i>
      </div>
      <Row>
        <Col sm={1}>
          <div className="book__list__item__img">
            <img src={book?.image_book} alt="" />
          </div>
        </Col>
        <Col sm={11}>
          <div className="book__data">
            <div className="book__data__author">
              Tác giả: <Link to="/author">Gia Bảo</Link>
            </div>
            <div className="book__data__publisher">
              Nhà xuất bản: <Link to="/publisher">Gia Bảo</Link>
            </div>
            <div className="book__data__album">
              Bộ sưu tập: <Link to="/album">Gia Bảo</Link>
            </div>
            <div className="book__data__id">
              Mã sách: <Link to="/album">{book.book_id}</Link>
            </div>
            <div className="book__data__category">
              <span>
                Thể loại: <Link to="/category">Trinh thám</Link>
              </span>
              <span>
                <InputNumber setNumber={setQuantity} number={quantity} />
                <button className="borrow-btn" onClick={handleBorrowBook}>
                  Mượn sách
                </button>
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FavoriteCard;
