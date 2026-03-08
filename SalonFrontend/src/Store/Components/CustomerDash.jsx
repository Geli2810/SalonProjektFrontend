import { Link } from "react-router-dom";

function CustomerDash() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif mb-6">Velkommen til din profil</h1>
      
      {/* Her er knappen til kalenderen */}
      <Link 
        to="/book" 
        className="bg-black text-white px-8 py-4 uppercase text-xs tracking-widest hover:bg-amber-900 transition shadow-lg"
      >
        Bestil en ny tid
      </Link>
    </div>
  );
}

export default CustomerDash;