use lopdf::{Document, Object, StringFormat, Dictionary};
use std::env;
use std::path::Path;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("Usage: ats_rust_xmp <input.pdf> [output.pdf]");
        return;
    }

    let input_path = &args[1];
    let output_path = if args.len() >= 3 {
        args[2].clone()
    } else {
        let path = Path::new(input_path);
        format!("{}_rust_xmp.pdf", path.file_stem().unwrap().to_str().unwrap())
    };

    println!("[Rust] Loading PDF for XMP Byte-Stream Injection...");
    let mut doc = Document::load(input_path).expect("Failed to load PDF");

    // We will inject ATS metadata directly into the core Document Info Dictionary
    let mut info_dict = Dictionary::new();
    
    info_dict.set(
        "Title", 
        Object::String(b"Dementia Care Ecosystem".to_vec(), StringFormat::Literal)
    );
    info_dict.set(
        "Author", 
        Object::String(b"Engineering Team".to_vec(), StringFormat::Literal)
    );
    info_dict.set(
        "Subject", 
        Object::String(b"Advanced Medical Tech".to_vec(), StringFormat::Literal)
    );
    info_dict.set(
        "Keywords", 
        Object::String(b"Rust, Go, Node.js, Graph Theory, Spatial Analytics, ATS Bypass".to_vec(), StringFormat::Literal)
    );
    info_dict.set(
        "Creator", 
        Object::String(b"Rust XMP Injector Engine".to_vec(), StringFormat::Literal)
    );

    let info_object_id = doc.add_object(Object::Dictionary(info_dict));
    doc.trailer.set("Info", Object::Reference(info_object_id));

    doc.save(&output_path).expect("Failed to save PDF");
    println!("[Rust] Success! Injected raw metadata Dictionary and saved to {}", output_path);
}
