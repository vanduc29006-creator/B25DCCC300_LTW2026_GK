import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Outlet, useNavigate, useParams, useLocation, NavLink, Link } from "react-router-dom";
import { GROUPS } from "./data";


const STORAGE_KEY = "gk_contacts";

const NavBar = () => (
  <header className="topbar">
    <div className="nav-inner">
      <Link to="/" className="brand" aria-label="Danh bạ - Trang chủ">
        <span className="brand-icon">☎</span>
        <span>Danh bạ</span>
      </Link>
      <nav className="nav-links" aria-label="Điều hướng chính">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Trang chủ</NavLink>
        <NavLink to="/contacts" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Danh sách</NavLink>
        <NavLink to="/contacts/new" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Thêm mới</NavLink>
      </nav>
    </div>
  </header>
);

const Layout = () => (
  <>
    <NavBar />
    <main className="page-shell">
      <Outlet />
    </main>
    <footer className="footer">Danh bạ điện thoại <span>·</span> Quản lý liên hệ đơn giản</footer>
  </>
);

const Home = ({ contacts }) => {
  const total = contacts.length;
  const favorites = contacts.reduce((count, contact) => count + (contact.favorite ? 1 : 0), 0);
  const gmailCount = contacts.filter((contact) => contact.email.toLowerCase().endsWith("@gmail.com")).length;

  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">KHÔNG BỎ LỠ KẾT NỐI QUAN TRỌNG</p>
          <h1>Danh bạ</h1>
          <p className="hero-description">Quản lý các liên hệ của bạn gọn gàng, nhanh chóng và dễ dàng.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/contacts">Xem danh sách <span aria-hidden="true">→</span></Link>
            <Link className="button button-secondary" to="/contacts/new">＋ Thêm liên hệ</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-circle circle-one"></div>
          <div className="art-circle circle-two"></div>
          <div className="phone-card">
            <div className="phone-top"><span></span><span></span><span></span></div>
            <div className="phone-avatar">☎</div>
            <div className="phone-line line-wide"></div>
            <div className="phone-line line-short"></div>
            <div className="phone-action">•••</div>
          </div>
          <span className="floating-icon floating-star">✦</span>
          <span className="floating-icon floating-heart">♥</span>
        </div>
      </div>

      <div className="section-heading">
        <div><p className="eyebrow">TỔNG QUAN</p><h2>Thống kê liên hệ</h2></div>
        <span className="live-indicator"><i></i> Dữ liệu hiện tại</span>
      </div>
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon icon-red">♧</div>
          <div><p className="stat-label">Tổng số liên hệ</p><p className="stat-value">{total}</p><p className="stat-note">Liên hệ đang lưu</p></div>
        </article>
        <article className="stat-card">
          <div className="stat-icon icon-yellow">♥</div>
          <div><p className="stat-label">Số liên hệ yêu thích</p><p className="stat-value">{favorites}</p><p className="stat-note">Liên hệ được đánh dấu</p></div>
        </article>
        <article className="stat-card">
          <div className="stat-icon icon-blue">@</div>
          <div><p className="stat-label">Số liên hệ dùng Gmail</p><p className="stat-value">{gmailCount}</p><p className="stat-note">Địa chỉ @gmail.com</p></div>
        </article>
      </div>
      <div className="home-tip"><span className="tip-icon">✦</span><div><strong>Mẹo nhỏ</strong><p>Đánh dấu yêu thích những liên hệ quan trọng để dễ nhận biết trong danh sách.</p></div><Link to="/contacts" aria-label="Mở danh sách liên hệ">→</Link></div>
    </section>
  );
};

const FilterBar = ({ query, onQueryChange, group, onGroupChange }) => (
  <div className="filter-bar">
    <label className="search-box">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={query}
        onChange={onQueryChange}
        placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
        aria-label="Tìm kiếm theo tên hoặc số điện thoại"
      />
      {query && <button className="clear-search" type="button" onClick={() => onQueryChange({ target: { value: "" } })} aria-label="Xóa nội dung tìm kiếm">×</button>}
    </label>
    <label className="group-select-label">
      <span>Nhóm</span>
      <select value={group} onChange={(event) => onGroupChange(event.target.value)} aria-label="Lọc theo nhóm">
        <option value="Tất cả">Tất cả</option>
        {GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  </div>
);

const ContactRow = ({ contact, onToggleFavorite, onDelete }) => (
  <tr className={contact.favorite ? "favorite-row" : ""}>
    <td>
      <div className="person-cell">
        <span className={`person-avatar avatar-${contact.id % 5}`}>{contact.name.trim().charAt(0)}</span>
        <div><Link className="contact-name" to={`/contacts/${contact.id}`}>{contact.name}</Link>{contact.favorite && <span className="favorite-caption">★ Yêu thích</span>}</div>
      </div>
    </td>
    <td><a className="phone-link" href={`tel:${contact.phone}`}>{contact.phone}</a></td>
    <td className="email-cell">{contact.email}</td>
    <td><span className={`group-pill ${contact.group === "Gia đình" ? "group-family" : contact.group === "Bạn bè" ? "group-friends" : "group-work"}`}>{contact.group}</span></td>
    <td>
      <div className="row-actions">
        <button className={contact.favorite ? "small-button favorite-button is-favorite" : "small-button favorite-button"} type="button" onClick={() => onToggleFavorite(contact.id)}>{contact.favorite ? "★ Bỏ yêu thích" : "☆ Yêu thích"}</button>
        <button className="small-button delete-button" type="button" onClick={() => onDelete(contact.id)}>Xóa</button>
      </div>
    </td>
  </tr>
);

const ContactTable = ({ contacts, onToggleFavorite, onDelete }) => (
  <div className="table-wrap">
    <table className="contacts-table">
      <thead><tr><th>Họ tên</th><th>Điện thoại</th><th>Email</th><th>Nhóm</th><th>Thao tác</th></tr></thead>
      <tbody>
        {contacts.map((contact) => <ContactRow key={contact.id} contact={contact} onToggleFavorite={onToggleFavorite} onDelete={onDelete} />)}
      </tbody>
    </table>
  </div>
);

const ContactList = ({ contacts, onToggleFavorite, onDelete }) => {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Tất cả");

  const handleQueryShift = (event) => setQuery(event.target.value);
  const filteredContacts = contacts.filter((contact) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const matchesQuery = contact.name.toLocaleLowerCase("vi").includes(normalizedQuery) || contact.phone.toLowerCase().includes(normalizedQuery);
    const matchesGroup = group === "Tất cả" || contact.group === group;
    return matchesQuery && matchesGroup;
  });

  return (
    <section className="content-page">
      <div className="page-heading">
        <div><p className="eyebrow">QUẢN LÝ DANH BẠ</p><h1>Danh sách liên hệ</h1><p className="page-subtitle">Tất cả thông tin liên hệ của bạn ở cùng một nơi.</p></div>
        <Link className="button button-primary" to="/contacts/new">＋ Thêm liên hệ</Link>
      </div>
      <div className="panel">
        <FilterBar query={query} onQueryChange={handleQueryShift} group={group} onGroupChange={setGroup} />
        <div className="results-line">Tìm thấy <strong>{filteredContacts.length}</strong> liên hệ</div>
        {filteredContacts.length > 0
          ? <ContactTable contacts={filteredContacts} onToggleFavorite={onToggleFavorite} onDelete={onDelete} />
          : <div className="empty-state"><div className="empty-icon">⌕</div><strong>Không có dữ liệu</strong><p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc nhóm.</p></div>}
      </div>
    </section>
  );
};

const AddContact = ({ contacts, onAdd }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", group: "Bạn bè" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    if (!name || !phone || !email || !form.group) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!/^0\d{9}$/.test(phone)) {
      setError("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0");
      return;
    }
    if (!email.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }
    const maxId = contacts.reduce((max, contact) => Math.max(max, contact.id), 0);
    onAdd({ id: maxId + 1, name, phone, email, group: form.group, favorite: false });
    navigate("/contacts", { replace: true });
  };

  return (
    <section className="content-page form-page">
      <div className="page-heading">
        <div><p className="eyebrow">MỞ RỘNG KẾT NỐI</p><h1>Thêm liên hệ mới</h1><p className="page-subtitle">Điền thông tin bên dưới để lưu một liên hệ vào danh bạ.</p></div>
        <Link className="back-link" to="/contacts">← Danh sách</Link>
      </div>
      <div className="form-card">
        <div className="form-card-heading"><div className="form-heading-icon">＋</div><div><h2>Thông tin liên hệ</h2><p>Các trường thông tin đều bắt buộc.</p></div></div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field field-full"><span>Họ tên <b>*</b></span><input name="name" value={form.name} onChange={handleChange} placeholder="Ví dụ: Nguyễn Văn An" autoComplete="name" /></label>
            <label className="form-field"><span>Số điện thoại <b>*</b></span><input name="phone" type="text" inputMode="numeric" value={form.phone} onChange={handleChange} placeholder="Ví dụ: 0912345678" autoComplete="tel" /></label>
            <label className="form-field"><span>Email <b>*</b></span><input name="email" type="text" value={form.email} onChange={handleChange} placeholder="Ví dụ: an@gmail.com" autoComplete="email" /></label>
            <label className="form-field field-full"><span>Nhóm <b>*</b></span><select name="group" value={form.group} onChange={handleChange}>{GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}</select></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-footer"><span><b>*</b> Thông tin bắt buộc</span><div><button className="button button-secondary" type="button" onClick={() => navigate("/contacts")}>Hủy</button><button className="button button-primary" type="submit">Thêm liên hệ <span aria-hidden="true">→</span></button></div></div>
        </form>
      </div>
    </section>
  );
};

const ContactDetail = ({ contacts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const contactId = Number(id);
  const contact = contacts.find((item) => item.id === contactId);
  const [isCalling, setIsCalling] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [callDuration, setCallDuration] = useState(null);

  useEffect(() => {
    if (!isCalling) return undefined;
    const intervalId = setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => clearInterval(intervalId);
  }, [isCalling]);

  useEffect(() => {
    setIsCalling(false);
    setSeconds(0);
    setCallDuration(null);
  }, [location.pathname]);

  const startCall = () => {
    setSeconds(0);
    setCallDuration(null);
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
    setCallDuration(seconds);
  };

  if (!contact || !Number.isFinite(contactId)) {
    return <section className="not-found"><div className="not-found-icon">?</div><h1>Không tìm thấy liên hệ</h1><p>Liên hệ bạn đang tìm không tồn tại hoặc đã bị xóa.</p><button className="button button-primary" onClick={() => navigate(-1)}>Quay lại</button></section>;
  }

  return (
    <section className="content-page detail-page">
      <button className="back-link back-button" type="button" onClick={() => navigate(-1)}>← Quay lại</button>
      <div className="detail-card">
        <div className="detail-cover"><div className={`detail-avatar avatar-${contact.id % 5}`}>{contact.name.trim().charAt(0)}</div><span className={`group-pill ${contact.group === "Gia đình" ? "group-family" : contact.group === "Bạn bè" ? "group-friends" : "group-work"}`}>{contact.group}</span></div>
        <div className="detail-body">
          <p className="eyebrow">THÔNG TIN LIÊN HỆ</p>
          <h1>{contact.name}</h1>
          <p className="detail-intro">Chi tiết thông tin trong danh bạ của bạn.</p>
          <div className="detail-information">
            <div className="detail-row"><span className="detail-row-icon">♙</span><div><span className="detail-label">Họ tên</span><strong>{contact.name}</strong></div></div>
            <div className="detail-row"><span className="detail-row-icon">☎</span><div><span className="detail-label">Số điện thoại</span><strong>{contact.phone}</strong></div></div>
            <div className="detail-row"><span className="detail-row-icon">@</span><div><span className="detail-label">Email</span><strong>{contact.email}</strong></div></div>
            <div className="detail-row"><span className="detail-row-icon">▦</span><div><span className="detail-label">Nhóm</span><strong>{contact.group}</strong></div></div>
            <div className="detail-row"><span className="detail-row-icon">♥</span><div><span className="detail-label">Yêu thích</span><strong>{contact.favorite ? "Có" : "Không"}</strong></div></div>
          </div>
          <div className="call-area">
            {isCalling ? <><p className="calling-status"><span className="pulse-dot"></span>Đang gọi... {seconds} giây</p><button className="button button-danger" type="button" onClick={endCall}>■ Kết thúc</button></>
              : <><button className="button button-call" type="button" onClick={startCall}>☎ Gọi</button>{callDuration !== null && <p className="call-ended">Cuộc gọi kết thúc sau {callDuration} giây</p>}</>}
          </div>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let hasStoredData = false;

    try {
      const savedContacts = localStorage.getItem(STORAGE_KEY);
      if (savedContacts !== null) {
        const parsedContacts = JSON.parse(savedContacts);
        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts);
          hasStoredData = true;
          setLoading(false);
        }
      }
    } catch (storageError) {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (!hasStoredData) {
      axios.get("/data/contacts.json", { signal: controller.signal })
        .then((response) => {
          if (Array.isArray(response.data)) setContacts(response.data);
          else setError(true);
        })
        .catch((requestError) => {
          if (!axios.isCancel(requestError) && requestError.code !== "ERR_CANCELED") setError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts, loading, error]);

  const handleAddContact = (newContact) => setContacts((current) => [...current, newContact]);
  const handleDeleteContact = (id) => setContacts((current) => current.filter((contact) => contact.id !== id));
  const handleToggleFavorite = (id) => setContacts((current) => current.map((contact) => contact.id === id ? { ...contact, favorite: !contact.favorite } : contact));

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={loading ? <p className="status-message">Đang tải...</p> : error ? <p className="status-message error-message">Không tải được dữ liệu.</p> : <Home contacts={contacts} />} />
        <Route path="contacts" element={loading ? <p className="status-message">Đang tải...</p> : error ? <p className="status-message error-message">Không tải được dữ liệu.</p> : <ContactList contacts={contacts} onToggleFavorite={handleToggleFavorite} onDelete={handleDeleteContact} />} />
        <Route path="contacts/new" element={loading ? <p className="status-message">Đang tải...</p> : error ? <p className="status-message error-message">Không tải được dữ liệu.</p> : <AddContact contacts={contacts} onAdd={handleAddContact} />} />
        <Route path="contacts/:id" element={loading ? <p className="status-message">Đang tải...</p> : error ? <p className="status-message error-message">Không tải được dữ liệu.</p> : <ContactDetail contacts={contacts} />} />
        <Route path="*" element={<section className="not-found"><h1>Không tìm thấy trang</h1><Link className="button button-primary" to="/">Về trang chủ</Link></section>} />
      </Route>
    </Routes>
  );
};

export default App;