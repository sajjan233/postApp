const QueryBox = ({ postId, adminId }) => {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    message: ''
  });

  const submitQuery = async () => {
    await axios.post("/api/query", {
      ...form,
      postId,
      adminId
    });
    alert("Query sent successfully");
    setForm({ name: '', mobile: '', message: '' });
  };

  return (
    <div className="query-box">
      <h3>Ask Your Question</h3>

      <input
        placeholder="Your Name (optional)"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Mobile (optional)"
        value={form.mobile}
        onChange={e => setForm({ ...form, mobile: e.target.value })}
      />

      <textarea
        placeholder="Write your query..."
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />

      <button onClick={submitQuery}>Submit</button>
    </div>
  );
};
