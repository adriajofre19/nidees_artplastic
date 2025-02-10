"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the form submission
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen">
            {/* Header Image Section */}
            <div className="relative h-[40vh] mb-12">
                <Image
                    src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d"
                    alt="Contact Us"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-light mb-4">Contacta amb Nosaltres</h1>
                        <p className="text-lg max-w-2xl mx-auto px-4">
                            Tens alguna pregunta o suggeriment? Ens encantaria escoltar-te!
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="max-w-2xl mx-auto px-4 pb-16">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Nom
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="El teu nom"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="El teu email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                                Assumpte
                            </label>
                            <Input
                                id="subject"
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                placeholder="Assumpte del missatge"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-700">
                                Missatge
                            </label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                placeholder="El teu missatge"
                                className="h-32"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Missatge
                        </Button>
                    </form>

                    {/* Additional Contact Information */}
                    <div className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2">Adreça</h3>
                            <p className="text-gray-600">
                                Carrer Example, 123<br />
                                17001 Girona<br />
                                Catalunya
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Contacte</h3>
                            <p className="text-gray-600">
                                Email: info@nidees.com<br />
                                Tel: +34 972 123 456
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}